import { Request } from 'express';

// express-fileupload types will augment Express.Request with the 'files' property.
// We only need to add our custom 'user' property here.

export interface CustomRequest extends Request {
  user?: {
    userId: string;
    // Add any other user properties from your auth middleware
  };
  // files?: FileArray | null; // We'll add this back if TS still complains in consuming files
}
