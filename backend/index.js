import express from "express";
import cors from "cors";
import authRouter from "./router/authRouter.js";
import connectDB from "./config/db.js"
import dotenv from "dotenv";
import session from "express-session";
// import passport from "passport";
import "./google_auth/passportConfig.js";
import passport from "passport";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

app.use(session({
    secret: process.env.GOOGLE_SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
connectDB();


const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

