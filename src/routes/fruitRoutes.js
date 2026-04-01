import express from "express";
import prisma from "../prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendLowStockEmail = async (fruit) => {
  const msg = {
    to: "doris.edo@ada.ac.uk",
    from: "doris.edo@ada.ac.uk",
    subject: `Low stock alert: ${fruit.name}`,
    text: `${fruit.name} stock is low (${fruit.stockQuantity} left).`,
  };

  try {
    await sgMail.send(msg);
    console.log("Low stock email sent");
  } catch (error) {
    console.error("Email error:", error);
  }
};

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
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

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      supplier,
      expiryDate,
      imageUrl,
      categoryId,
    } = req.body;

    const newFruit = await prisma.fruit.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        imageUrl,
        categoryId,
      },
      include: { category: true },
    });

    res.status(201).json(newFruit);
    if (newFruit.stockQuantity <= 5) {
      await sendLowStockEmail(newFruit);
    }
  } catch (error) {
    console.error("Error creating fruit:", error);
    res.status(500).json({ error: "Failed to create fruit" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stockQuantity,
      supplier,
      expiryDate,
      imageUrl,
      categoryId,
    } = req.body;

    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: "Price cannot be negative" });
    }

    if (stockQuantity !== undefined && stockQuantity < 0) {
      return res.status(400).json({ error: "Stock cannot be negative" });
    }

    const updatedFruit = await prisma.fruit.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        stockQuantity,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        imageUrl,
        categoryId,
      },
      include: { category: true },
    });

    res.json(updatedFruit);
    if (updatedFruit.stockQuantity <= 5) {
      await sendLowStockEmail(updatedFruit);
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update fruit" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.fruit.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Fruit deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete fruit" });
  }
});

export default router;
