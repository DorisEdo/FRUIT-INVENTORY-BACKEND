import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const fruits = await prisma.fruit.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(fruits);
  } catch (error) {
    console.error("Error fetching fruits:", error);
    res.status(500).json({ error: "Failed to fetch fruits" });
  }
});

export default router;
