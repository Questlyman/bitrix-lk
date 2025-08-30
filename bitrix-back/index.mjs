import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { getDeals } from "./deals.mjs";
import { login } from "./auth.mjs"; // <-- наш роут-обработчик логина
import { addDeal } from "./addDeal.mjs";

const app = express();
const PORT = process.env.PORT || 3000;
const B24 = process.env.B24_WEBHOOK_BASE;
export { B24 };
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN?.split(",") || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/auth/login", login);

app.get("/getdeals/:id", getDeals);

app.post("/createdeal", addDeal);
app.listen(PORT, () => {
  console.log(`✅ API слушает на http://localhost:${PORT}`);
});
