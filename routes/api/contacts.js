const express = require("express");
const router = express.Router();
const method = require("../../models/contacts");
const { ValidationSchema, PatchSchema } = require("../../validation/validation");
const HttpError = require("../../validation/HttpError");
const  { validateContactId } = require("../../middlewars");




router.get('/',  async (req, res, next) => {
  try {
    const answer = await method.listContacts();
    res.json(answer);
  } catch (error) {
    next( HttpError(500, error.message));
  }
});

router.get('/:contactId', validateContactId,  async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const answer = await method.getContactById(contactId);
    if (!answer) {
      throw  HttpError(404, 'Not found');
    } 
    res.json(answer);
  } catch (error) {
    next(error);
  }
});

router.post('/',  async (req, res, next) => {
  
    try {
      const { name, email, phone } = req.body;
  
      // Валідація вхідних даних
      const { error } = ValidationSchema.validate({ name, email, phone });
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const answer = await method.addContact({ name, email, phone });
      res.status(201).json(answer);
    } catch (error) {
      next(error);
    }
  });
  

router.delete('/:contactId', validateContactId,  async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const answer = await method.removeContact(contactId);
    if (answer) {
      res.json({ message: 'contact deleted' });
    } else {
      throw  Error(404, 'Not found');
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validateContactId,  async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    const { error } = ValidationSchema.validate({ name, email, phone });

    if (error) {
      throw  HttpError(400, error.details[0].message);
    }

    const answer = await method.updateContact(contactId, { name, email, phone });
    if (!answer) {
      throw  HttpError(404, 'Not found');
    }

    res.json(answer);
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', validateContactId,  async (req, res, next) => {
try {
const {contactId} = req.params;
const {favorite} = req.body;
const { error } = PatchSchema.validate({ favorite });
if (favorite === undefined) {
  throw  HttpError(400, 'missing field favorite');
}

if (error) {
  throw HttpError(400, error.details[0].message);
}

// Виклик функції updateStatusContact
const updatedContact = await method.updateStatusContact(contactId, { favorite });

if (!updatedContact) {
  throw  HttpError(404, 'Not found');
}

res.json(updatedContact);
} catch(error) {
  next(error);
}
})


module.exports = router;