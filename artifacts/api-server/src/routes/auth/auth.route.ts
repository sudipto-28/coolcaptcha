import { db, usersTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// POST /auth/login - Login endpoint
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: true,
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Email and password are required",
      });
      return;
    }

    // Find user by email (case-insensitive)
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    if (users.length === 0) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid email or password",
      });
      return;
    }

    const user = users[0];

    // Check if user account is active
    if (!user.isActive) {
      res.status(403).json({
        error: true,
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "Account is inactive",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid email or password",
      });
      return;
    }

    // Update last login timestamp
    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, user.id));

    // Generate JWT token
    const tokenExpiry = remember ? "30d" : "24h";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to login",
    });
  }
});

// GET /auth/me - Get current user endpoint
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "No token provided",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Get user from database
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId));

    if (users.length === 0) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid or expired token",
      });
      return;
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({
      error: true,
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
});

export default router;
