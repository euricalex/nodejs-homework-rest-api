const fs = require("node:fs/promises");
const path = require("node:path");
const User = require("../models/user");

async function uploadAvatar(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).send({message: "File not attached or in an invalid format"});

        }
        await fs.rename(req.file.path, path.join(__dirname, "../public/avatars", req.file.filename ) );

     
        const user = await User.findByIdAndUpdate(req.user.id, {avatarURL: req.file.filename}, {new: true}).exec();
        if(user === null) {
           return res.status(404).send({message: "Not Found"}); 
    
        }
        res.send(user);
     
    } catch(error) {
        next(error);
    }
    
}

async function getAvatar (req, res, next) {
    try {
      
const user = await User.findById(req.user.id).exec();
if(user === null) {
    return res.status(404).send({message: "Not Found"}); 

 }
 if(user.avatarURL === null) {
    return res.status(404).send({message: "Avatar Not Found"}); 

 }
 console.log(user);
 res.sendFile(path.join(__dirname, "../public/avatars", user.avatarURL));
    } catch(error) {

    }
}
module.exports = {uploadAvatar, getAvatar};
