const express = require("express");
const mongoose = require("mongoose");
const { createOne, login,Signup } = require('./auth_creator'); // Destructure the exports
const bodyParser = require('body-parser');
const cors = require('cors'); 
const student_routes=require('./student/student_routes');
const App = express();
const path = require('path');
const College_routes=require('./college/college_routes');
const Recuiter_routes=require('./recuiter/RecuiterRoutes');
App.use(express.json());
App.use(cors({ 
    origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));



App.get('/', (req, res) => {
    res.status(200).json({ "message": "welcome to linked-link" });
});

App.get('/create', createOne); // Use POST for creation
App.post('/login', login); // Use POST for login
App.post('/signup',Signup)

App.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
App.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));
App.use('/student',student_routes);
App.use('/college',College_routes);
App.use('/recuiter',Recuiter_routes);


const PORT = 5000;
App.listen(PORT, () => {
    console.log(`API started at http://localhost:${PORT}`);
});

mongoose.connect("mongodb://localhost:27017/")