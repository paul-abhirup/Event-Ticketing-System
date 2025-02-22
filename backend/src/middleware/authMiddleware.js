const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
