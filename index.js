import express from "express";
import cors from "cors";
import UserRouter from "./routes/user/UserRoute.js";
import cookieParser from "cookie-parser";
import IPRouter from "./routes/ip/IpRouter.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is working fine" });
});

app.use("/api/auth", UserRouter);
app.use("/api/history", IPRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`listening to port ${PORT}`));
