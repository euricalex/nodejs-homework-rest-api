const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require("node:path");



const contactsRouter = require('./routes/api/contacts')


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use("/avatars", express.static(path.join(__dirname, "./public/avatars" )))
const authRouter = require("./routes/auth.js");
const {auth} = require("./middlewars.js");
app.use("/api/users", auth, authRouter);





const userRoutes = require("./routes/auth.js");
app.use("/users", auth, userRoutes);

// app.use(express.static(path.join(__dirname, "public")));

app.use('/api/contacts', auth, contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res) => {
  res.status(500).json({ message: err.message })
})

module.exports = app