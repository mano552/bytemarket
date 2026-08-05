import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthPayload, Role, ApiResponse } from "../types";
import { createResponse } from "../utils/response";

// Extend Express's Request type globally so `req.user` is typed everywhere,
// instead of using `any` at every route that needs auth.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): void {
  const header: string | undefined = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json(createResponse<null>(false, null, "No token provided"));
    return;
  }

  const token: string = header.split(" ")[1];

  try {
    const payload: AuthPayload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json(createResponse<null>(false, null, "Invalid or expired token"));
  }
}

// Generic-ish role guard - pass in which roles are allowed for this route
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response<ApiResponse<null>>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(createResponse<null>(false, null, "Not authenticated"));
      return;
    }

    // Type narrowing: TS knows req.user is AuthPayload (not undefined) past this point
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json(createResponse<null>(false, null, "Forbidden: insufficient role"));
      return;
    }

    next();
  };
}
