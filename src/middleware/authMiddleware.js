// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user;

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
      });

      if (dbUser) {
        req.user.role = dbUser.role;
      }
    } catch (e) {
      console.error("Failed to fetch user role:", e);
    }

    next();
  });
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};
