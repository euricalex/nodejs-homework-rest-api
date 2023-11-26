const mongoose = require("mongoose");
const validateContactId = (req, res, next) => {
    const { contactId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      // Якщо contactId не є валідним ObjectId
      return res.status(404).json({ message: 'Not found' });
    }
  
    next();
  };
  module.exports = {
    validateContactId
  }