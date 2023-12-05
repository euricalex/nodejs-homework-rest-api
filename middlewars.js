const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto =  require("node:crypto");
const path = require("node:path");
const User = require("./models/user");
const validateContactId = (req, res, next) => {
    const { contactId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      // Якщо contactId не є валідним ObjectId
      return res.status(404).json({ message: 'Not found' });
    }
  
    next();
  };

  function auth(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).send({ message: 'Not authorized' });
    }
  
    const [bearer, token] = authHeader.split(" ", 2);
  
    if (bearer !== "Bearer") {
      return res.status(401).send({ message: 'Not authorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
      if (error) {
        console.error("JWT verification error:", error);
        return res.status(401).send({ message: "Not authorized" });
      }
  
      try {
        req.user = decode;
        const user = await User.findById(decode.id).exec();
  
        if (user === null) {
          return res.status(401).send({ message: "Not authorized" });
        }
        if(user.verify !== true) {
          return res.status(401).send({message: "Your account is not verified"});
        }
  
        req.user = { id: user._id };
        next();
      } catch (error) {
        next(error);
      }
    });
  }
  


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, path.join(__dirname,  "./tmp"));
    },
   filename: (req, file, cb) => {
    console.log(file);

    const extname = path.extname(file.originalname);
   const basename = path.basename(file.originalname, extname);
const suffix = crypto.randomUUID()
cb(null, `${basename}-${suffix}${extname}`);
   },
});
const upload = multer({storage});


  module.exports = { validateContactId, auth, upload };