import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();

const rawEndpoint = process.env.MINIO_ENDPOINT || "minioapi.appadvent.in";
let endPoint = rawEndpoint.trim();
let useSSL = process.env.MINIO_USE_SSL === "true" || rawEndpoint.startsWith("https://");
let port = process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : (useSSL ? 443 : 9000);

if (endPoint.startsWith("http://")) {
  endPoint = endPoint.replace(/^http:\/\//, "");
  useSSL = false;
  if (!process.env.MINIO_PORT) port = 80;
} else if (endPoint.startsWith("https://")) {
  endPoint = endPoint.replace(/^https:\/\//, "");
  useSSL = true;
  if (!process.env.MINIO_PORT) port = 443;
}

// Remove trailing slashes or subpaths if present
endPoint = endPoint.split("/")[0];

// Extract port if embedded in endpoint (e.g. host:9000)
if (endPoint.includes(":")) {
  const [host, p] = endPoint.split(":");
  endPoint = host;
  port = Number(p);
}

const accessKey = process.env.MINIO_ACCESS_KEY || "";
const secretKey = process.env.MINIO_SECRET_KEY || "";
export const BUCKET_NAME = process.env.MINIO_BUCKET || process.env.MINIO_BUCKET_NAME || "i-mag";
export const REGION = process.env.MINIO_REGION || "ap-south-1";

export const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
  region: REGION,
});

export const getMinioPublicUrl = (key: string): string => {
  const protocol = useSSL ? "https" : "http";
  const portSuffix = (port === 80 && !useSSL) || (port === 443 && useSSL) ? "" : `:${port}`;
  return `${protocol}://${endPoint}${portSuffix}/${BUCKET_NAME}/${key}`;
};

export const initMinioBucket = async (): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, REGION);
      console.log(`[MinIO] Bucket "${BUCKET_NAME}" created successfully.`);

      // Set public read policy for the bucket
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetBucketLocation", "s3:ListBucket"],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}`],
          },
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`[MinIO] Bucket "${BUCKET_NAME}" set to public read policy.`);
    } else {
      console.log(`[MinIO] Connected to bucket "${BUCKET_NAME}".`);
    }
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED" || error?.name === "AggregateError") {
      console.warn(
        `[MinIO Warning] Unable to connect to MinIO at ${endPoint}:${port}. Please verify MinIO host and credentials.`
      );
    } else {
      console.error("[MinIO Error] Error initializing MinIO bucket:", error?.message || error);
    }
  }
};
