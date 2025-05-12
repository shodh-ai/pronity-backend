import { Request } from 'express';

// Define the UploadedFile type for express-fileupload
interface UploadedFile {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (path: string, callback: (err?: any) => void) => void;
}

export interface CustomRequest extends Request {
  user?: {
    userId: string;
    // Add any other user properties from your auth middleware
  };
  files?: {
    [fieldname: string]: UploadedFile | UploadedFile[];
  };
}
