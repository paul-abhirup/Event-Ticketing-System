const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    // Log the full authorization header
    console.log("Auth header:", req.header("Authorization"));

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Ensure proper Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token format. Must be 'Bearer <token>'",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Log the extracted token
    console.log("Extracted token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        message: "Invalid token.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({
      message: "Authentication error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = authenticate;
