require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const AdminModel = require('../server/Models/Admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  
})
.then(() => console.log('Mongoose connected'))
.catch(err => console.error('Error connecting to MongoDB', err));


app.post('/register', async (req, res) => {
  try {
    console.log(req.body); 
    const { email, password, name, number } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new AdminModel({
      email,
      password: hashedPassword,
      name,
      number
    });

    const savedAdmin = await newAdmin.save();
    res.json(savedAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminModel.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).json({ message: "Success" });
      } else {
        res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ message: "No record found, please create an account" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});


app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
