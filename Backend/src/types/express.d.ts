// src/types/express.d.ts

import type * as multer from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      files?: multer.File[] | { [fieldname: string]: multer.File[] };
    }
  }
}

export {};
