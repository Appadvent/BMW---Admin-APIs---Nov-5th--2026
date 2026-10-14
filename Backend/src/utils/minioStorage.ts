import { minioClient, BUCKET_NAME, getMinioPublicUrl } from "../config/minio.config";

/**
 * Extracts the object key from a full MinIO/S3/CloudFront URL or returns the key as is.
 */
export const extractMinIOKey = (urlOrKey: string): string => {
  if (!urlOrKey) return "";

  // If it's already a relative key (e.g. "products/12345-image.jpg")
  if (!urlOrKey.startsWith("http://") && !urlOrKey.startsWith("https://")) {
    return decodeURIComponent(urlOrKey.replace(/^\/+/, ""));
  }

  try {
    const parsedUrl = new URL(urlOrKey);
    // Ignore third-party domains (like unsplash, cdn, etc.)
    if (!parsedUrl.pathname.includes(BUCKET_NAME) && !urlOrKey.includes(BUCKET_NAME)) {
      return "";
    }

    let pathname = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, "")); // e.g. "i-mag/products/123-file.png"

    // If bucket name is the first path segment, remove it
    if (pathname.startsWith(`${BUCKET_NAME}/`)) {
      pathname = pathname.substring(BUCKET_NAME.length + 1);
    }
    return pathname;
  } catch {
    return "";
  }
};

/**
 * Uploads a Multer file buffer directly to MinIO storage and returns the public URL.
 */
export const uploadFileToMinIO = async (
  file: any,
  folder: string = "uploads"
): Promise<string> => {
  const sanitizedName = (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `${folder}/${Date.now()}-${sanitizedName}`;

  const metaData = {
    "Content-Type": file.mimetype || "application/octet-stream",
  };

  await minioClient.putObject(
    BUCKET_NAME,
    objectKey,
    file.buffer,
    file.size,
    metaData
  );

  return getMinioPublicUrl(objectKey);
};

/**
 * Deletes a file from MinIO storage given its URL or object key.
 */
export const deleteFileFromMinIO = async (fileUrlOrKey: string): Promise<void> => {
  if (!fileUrlOrKey) return;
  try {
    const key = extractMinIOKey(fileUrlOrKey);
    if (!key) return;

    await minioClient.removeObject(BUCKET_NAME, key);
    console.log(`[MinIO] Successfully deleted object: ${key}`);
  } catch (error) {
    console.error(`[MinIO] Error deleting object "${fileUrlOrKey}":`, error);
  }
};

/**
 * List all files in a folder or all folders
 */
export const listAllFilesFromMinIO = async (folderPrefix: string = ""): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    const stream = minioClient.listObjectsV2(BUCKET_NAME, folderPrefix, true);

    stream.on("data", (obj) => {
      data.push({
        name: obj.name,
        url: getMinioPublicUrl(obj.name || ""),
        size: obj.size,
        lastModified: obj.lastModified,
      });
    });

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("end", () => {
      resolve(data);
    });
  });
};
