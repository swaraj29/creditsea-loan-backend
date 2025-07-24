// Express namespace augmentation for custom req.user type
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
