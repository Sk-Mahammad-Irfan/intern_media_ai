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
    successRedirect: "http://localhost:5000/api/auth/success",
    failureRedirect: "http://localhost:5000/api/auth/failure",
    session: true
}))

router.get("/success", (req, res) => {
    console.log(req.user);
    res.send("success login using google");
})

router.get("/failure", (req, res) => {
    res.send("failure login using google");
})


export default router;
