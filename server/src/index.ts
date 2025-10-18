import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import morgan from "morgan";

import refresh from "./middleware/refresh-token-router";
import auth from "./routes/auth";
import tenant from "./routes/tenant";
import category from "./routes/category.route";
import food from "./routes/food.route";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://menu.hornsolution.com",
      "https://adminmenu.hornsolution.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

// ---------- ROUTES -----------
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/refresh", refresh);
app.use("/api/v1/tenant", tenant);
app.use("/api/v1/category", category);
app.use("/api/v1/food", food);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// ---------- START SERVER ----------

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
