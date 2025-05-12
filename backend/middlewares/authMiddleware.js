import JWT from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Unauthorized",
      error,
    });
  }
};
