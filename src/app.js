import express from "express";
import cors from "cors";
import fruitRoutes from "./routes/fruitRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Fruit Inventory API is running",
    status: "ok",
  });
});

app.use("/api/fruits", fruitRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
