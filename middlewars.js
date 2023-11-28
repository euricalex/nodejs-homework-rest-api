const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
    

const [bearer, token] = authHeader.split(" ", 2);
if(bearer !== token) {
   return res.status(401).send({message: "Not authorized"});
}

jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
  if(error) {
    return  res.status(401).send({message: "Not authorized"});
  }
  req.user = decode;
   next();
});

  }


  module.exports = {
    validateContactId,
    auth
  }