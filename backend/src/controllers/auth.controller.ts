import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/db";
import { signToken } from "../utils/jwt";
import { createResponse } from "../utils/response";
import {
  RegisterDTO,
  LoginDTO,
  GoogleLoginDTO,
  PublicUser,
  ApiResponse,
  Role,
} from "../types";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthResult {
  user: PublicUser;
  token: string;
}

// Strips the password field before sending a user back to the client
function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    createdAt: user.createdAt,
  };
}

export async function register(
  req: Request<{}, {}, RegisterDTO>,
  res: Response<ApiResponse<AuthResult>>
): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json(createResponse<AuthResult>(false, undefined, "All fields are required"));
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json(createResponse<AuthResult>(false, undefined, "Email already in use"));
    return;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token: string = signToken({ userId: user.id, role: user.role as Role });

  res.status(201).json(
    createResponse<AuthResult>(true, { user: toPublicUser(user), token })
  );
}

export async function login(
  req: Request<{}, {}, LoginDTO>,
  res: Response<ApiResponse<AuthResult>>
): Promise<void> {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json(createResponse<AuthResult>(false, undefined, "Invalid credentials"));
    return;
  }

  const isValid: boolean = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json(createResponse<AuthResult>(false, undefined, "Invalid credentials"));
    return;
  }

  const token: string = signToken({ userId: user.id, role: user.role as Role });

  res.json(createResponse<AuthResult>(true, { user: toPublicUser(user), token }));
}

// POST /api/auth/google - verifies a Google ID token, then finds or creates the user
export async function googleLogin(
  req: Request<{}, {}, GoogleLoginDTO>,
  res: Response<ApiResponse<AuthResult>>
): Promise<void> {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json(createResponse<AuthResult>(false, undefined, "Missing Google token"));
    return;
  }

  let email: string;
  let name: string;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(401).json(createResponse<AuthResult>(false, undefined, "Invalid Google token"));
      return;
    }

    email = payload.email;
    name = payload.name ?? payload.email.split("@")[0];
  } catch {
    res.status(401).json(createResponse<AuthResult>(false, undefined, "Invalid Google token"));
    return;
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Google-authenticated users never use a password, so store an unusable random hash
    const randomPassword: string = await bcrypt.hash(crypto.randomUUID(), 10);
    user = await prisma.user.create({
      data: { name, email, password: randomPassword },
    });
  }

  const token: string = signToken({ userId: user.id, role: user.role as Role });

  res.json(createResponse<AuthResult>(true, { user: toPublicUser(user), token }));
}
