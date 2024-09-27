const express = require("express");
const mongoose = require("mongoose");
const { createOne, login, Signup } = require('./auth_creator');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const student_routes = require('./student/student_routes');
const path = require('path');
const College_routes = require('./college/college_routes');
const Recuiter_routes = require('./recuiter/RecuiterRoutes');

const App = express();

App.use(express.json());
App.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Routes
App.get('/', (req, res) => {
  res.status(200).json({ "message": "welcome to linked-link" });
});

App.get('/create', createOne); // Use POST for creation
App.post('/login', login); // Use POST for login
App.post('/signup', Signup);

App.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
App.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));
App.use('/student', student_routes);
App.use('/college', College_routes);
App.use('/recuiter', Recuiter_routes);

// Export the app for serverless function
module.exports = App;

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://appalasaisumanth:Samy%40samy123@cluster0.3tbj05s.mongodb.net/jazee", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
