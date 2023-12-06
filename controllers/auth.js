const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../models/user");
const sendEmail = require("../helpers/sendEmail");

const { registrationSchema } = require("../validation/validation");

async function register(req, res, next) {
  const { password, email } = req.body;
  try {
    const { error } = { password, email };

    if (error) {
      return res
        .status(400)
        .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }
    const user = await User.findOne({ email }).exec();
    if (user) {
      return res.status(409).send({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    await sendEmail({
      to: email,
      subject: "Welcome to Users",
      html: `To confirm your registartion please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link<a/>`,
      text: `To confirm your registartion please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    await User.create({
      password: passwordHash,
      email,
      avatarURL,
      verificationToken,
    });

    res.status(201).send({ message: "Registartion successfuly" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  try {
    const { error } = registrationSchema.validate({ password, email });

    if (error) {
      return res
        .status(400)
        .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }

    const user = await User.findOne({ email }).exec();
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const loginHash = await bcrypt.compare(password, user.password);
    if (loginHash === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    if (user.verify !== true) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(user._id, { token }).exec();

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    return next({ status: 401, message: "Not authorized" });
  }
}

async function current(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyToken(req, res, next) {
  const { email } = req.body;
  if (!email) {
    res.status(400).send({ message: "missing required field email" });
  }
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token }).exec();
    if (user === null) {
      return res.status(404).send({ message: "User Not Found" });
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    }).exec();
    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.verify !== true) {
      const verificationToken = crypto.randomUUID();
      await sendEmail({
        to: email,
        subject: "Welcome to Users",
        html: `To confirm your registration please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link<a/>`,
        text: `To confirm your registration please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
      });

      await User.findByIdAndUpdate(user._id, { verificationToken }).exec();

      return res.status(200).json({ message: "Verification email sent" });
    }

    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  current,
  verifyToken,
  resendVerificationEmail,
};
