import express from "express";
import {
  registerController,
  loginController,
  testProtectedRoute,
  successGoogleLogin,
  failureGoogleLogin,
} from "../controller/authController.js";
import passport from "passport";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import JWT from "jsonwebtoken";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/redirect-with-user",
    failureRedirect: "/api/auth/failure",
    session: true,
  })
);

// Route to redirect with user data
router.get("/redirect-with-user", (req, res) => {
  if (!req.user) {
    return res.redirect("/api/auth/failure");
  }

  // Generate JWT token for the user
  const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Add token to user object
  const userWithToken = {
    ...(typeof req.user.toObject === "function"
      ? req.user.toObject()
      : req.user),
    token: token,
  };

  // Redirect to the frontend with user data
  const userDataParam = encodeURIComponent(JSON.stringify(userWithToken));
  res.redirect(
    `http://127.0.0.1:5500/intern_media_ai/frontend/auth-success.html?user=${userDataParam}`
  );
});

// Keep the success endpoint accessible for the frontend to fetch user data
router.get("/success", successGoogleLogin);

router.get("/failure", failureGoogleLogin);

// test protected route
router.get("/test", requireSignIn, testProtectedRoute);

export default router;
