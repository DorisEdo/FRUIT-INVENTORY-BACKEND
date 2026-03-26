import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

export default router;
