const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const validateContactId = (req, res, next) => {
    const { contactId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      // Якщо contactId не є валідним ObjectId
      return res.status(404).json({ message: 'Not found' });
    }
  
    next();
  };

  function auth (req, res, next) {
    const authHeader = req.headers.authorization;
    if(authHeader === "undefined") {
      return res.status(401).send({message: "Not authorizedddd"});      
    }
    

const [bearer, token] = authHeader.split(" ", 2);
if(bearer !== "Bearer") {
   return res.status(401).send({message: "Not authorizedddd"});
}

jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
  if (error) {
    console.error("JWT verification error:", error);
    return res.status(401).send({ message: "Not authorizedddd" });
  }
  try {
    req.user = decode;
    const user = await User.findById(decode.id).exec();
    if(user === null) {
      return res.status(401).send({ message: "Not authorized" });
    }
    if(user.token === token) {
      return res.status(401).send({ message: "Not authorized" });
      
    }
    req.user = {id: user._id}
    next();
  } catch(error) {
    next(error)
  }
  
});

  }


  module.exports = {
    validateContactId,
    auth
  }