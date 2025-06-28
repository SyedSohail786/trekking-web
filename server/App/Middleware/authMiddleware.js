const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = protect;
