import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

mongoose.connect('mongodb+srv://ssuvidh47:1234@cluster0.2mgpswc.mongodb.net/foodclub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


// Session config
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    firstName: String,
    lastName: String
  });
  const User = mongoose.model('users', userSchema);
  
  // Register endpoint
  app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      type: req.body.type,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    await user.save();
    res.send({ message: 'User registered' });
  });
  
  // Login endpoint
  app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      res.send({ message: 'Logged in', user });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
  
  // Get current user
  app.get('/current-user', async (req, res) => {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      res.send(user);
    } else {
      res.status(401).send({ message: 'Not logged in' });
    }
  });
  
  // Logout endpoint
  app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send({ message: 'Logged out' });
  });

  app.listen(4000);