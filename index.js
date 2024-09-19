require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const AdminModel = require('../Server/Models/Admin');

const app = express();
const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is not set
// Middlewares
app.use(cors()); // Enable CORS for all origins (can specify in production)
app.use(express.json()); // Enable JSON parsing for incoming requests

// Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

// Routes
app.post('/register', (req, res) => {
    AdminModel.create(req.body) 
        .then(admins => res.json(admins))
        .catch(err => res.status(500).json({ error: err.message })); // Improved error handling
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    AdminModel.findOne({ email: email })
      .then(user => {
        if (user) {
          if (user.password === password) {
            res.status(200).json({ message: "Success" }); // login successful
          } else {
            res.status(401).json({ message: "Incorrect Password" }); // wrong password
          }
        } else {
          res.status(404).json({ message: "No record found, please create an account" }); // no user found
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Server Error", error: err });
      });
  });
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
