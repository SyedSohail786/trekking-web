const jwt = require("jsonwebtoken");
const { userModel } = require("../models/UserModel");


const jwtVerify = async (req, res, next) => {
     const header = req.headers.authorization;
     let token;
     try {
          if (header) token = header.split(" ")[1];

          if (!token) return res.status(401).json({ msg: "Unauthorized - Token not provided" })
          const verifyJwt = jwt.verify(token, process.env.SECRET)


          if (!verifyJwt) return res.status(401).json({ msg: "Unauthorized - Invalid Token" })

          const userData = await userModel.findOne({ email: verifyJwt.email }).select("-password")
          req.userData = userData

          next()
     } catch (error) {
          console.log(error.message)
          res.send({
               msg: error.message
          })
     }

}

module.exports = { jwtVerify }