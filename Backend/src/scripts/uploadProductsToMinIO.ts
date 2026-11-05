import * as fs from "fs";
import * as path from "path";
import { minioClient, BUCKET_NAME, getMinioPublicUrl } from "../config/minio.config";

const EXTRACTED_DIR = path.resolve(__dirname, "../../extracted_images");
const MAPPING_FILE = path.resolve(__dirname, "./minio_image_mapping.json");

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function uploadFile(filename: string): Promise<string> {
  const filePath = path.join(EXTRACTED_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `products/${Date.now()}-${sanitizedName}`;

  await minioClient.putObject(
    BUCKET_NAME,
    objectKey,
    buffer,
    buffer.length,
    { "Content-Type": getMimeType(filename) }
  );

  return getMinioPublicUrl(objectKey);
}

export async function syncMinIOImages(): Promise<Record<string, string>> {
  console.log("Checking MinIO Image synchronization...");
  let mapping: Record<string, string> = {};
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
    } catch {
      mapping = {};
    }
  }

  if (!fs.existsSync(EXTRACTED_DIR)) {
    console.log("No extracted_images folder found, using existing mapping with", Object.keys(mapping).length, "images");
    return mapping;
  }

  const files = fs.readdirSync(EXTRACTED_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
  });

  const missing = files.filter((f) => !mapping[f]);
  console.log(`Found ${files.length} extracted images. ${missing.length} need upload to MinIO.`);

  for (let i = 0; i < missing.length; i++) {
    const f = missing[i];
    try {
      const url = await uploadFile(f);
      mapping[f] = url;
      console.log(`[${i + 1}/${missing.length}] Uploaded ${f} -> ${url}`);
    } catch (err: any) {
      console.error(`Failed to upload ${f}:`, err.message);
    }
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), "utf-8");
  console.log(`Updated mapping file saved with ${Object.keys(mapping).length} images.`);
  return mapping;
}

if (require.main === module) {
  syncMinIOImages()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
