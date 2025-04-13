import express from "express";
import { registerController, loginController, testProtectedRoute, successGoogleLogin, failureGoogleLogin } from "../controller/authController.js";
import passport from "passport";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/google", passport.authenticate("google", {
    scope:
        ["profile", "email"]
}))

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/api/auth/success",
    failureRedirect: "/api/auth/failure",
    session: true
}))

router.get("/success", successGoogleLogin)

router.get("/failure", failureGoogleLogin)

// test protected route
router.get("/test", requireSignIn, testProtectedRoute)


export default router;
