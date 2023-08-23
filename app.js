import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import RecipeLikesRoutes from "./receipeLikes/routes.js";
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
    req.session["currentUser"] = user;
    res.send({ message: 'User registered' });
  });
  
  // Login endpoint
  app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      req.session["currentUser"] = user;
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

  // Update user first name and last name
app.post('/update-user', async (req, res) => {
  if (req.session.userId) {
    try {
      await User.findByIdAndUpdate(req.session.userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      res.send({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating user' });
    }
  } else {
    res.status(401).send({ message: 'You must be logged in to update your profile' });
  }
});

app.delete('/delete-account/:id', async (req, res) => {
  try {
      const userId = req.params.id; // Assuming you have user in req through authentication middleware

      // Delete associated data
      // await ClubMember.deleteMany({ userId });
      // await Club.deleteMany({ createdBy: userId });
      // await BookReview.deleteMany({ userId });
      // await ReviewLike.deleteMany({ userId });
      // await UserLike.deleteMany({ userId });
      // await Announcement.deleteMany({ authorId: userId });

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the account' });
  }
});

app.get('/users', async (req, res) => {
  console.log("IN USERS");
  const users = await User.find();
  res.json(users);
});

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  vegetarian: String,
  cuisine: String,
  readyInMinutes: String,
  ingredients: String,
  instructions: String,
});
const Recipe = mongoose.model('recipes', recipeSchema);

app.post('/create-recipe', async (req, res) => {

  const recipe = new Recipe({
    title: req.body.title,
    image: req.body.image,
    vegetarian: req.body.vegetarian,
    cuisine: req.body.cuisine,
    readyInMinutes: req.body.readyInMinutes,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions

  });
  await recipe.save();
  res.send({ message: 'Recipe created' });
});

RecipeLikesRoutes(app);
app.listen(4000);