import express from "express";
import { registerController, loginController } from "../controller/authController.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/google", passport.authenticate("google", {
    scope:
        ["profile", "email"]
}))

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
    session: true
}))

router.get("/success", (req, res) => {
    res.send("success");
})

router.get("/failure", (req, res) => {
    res.send("failure");
})


export default router;
