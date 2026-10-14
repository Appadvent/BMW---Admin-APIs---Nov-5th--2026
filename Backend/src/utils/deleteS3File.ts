import { deleteFileFromMinIO, extractMinIOKey } from "./minioStorage";

/**
 * @deprecated Use deleteFileFromMinIO from ./minioStorage instead.
 */
export const extractS3Key = extractMinIOKey;

/**
 * @deprecated Use deleteFileFromMinIO from ./minioStorage instead.
 */
export const deleteS3File = deleteFileFromMinIO;
