require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const adoptRoutes=require('./routes/adopt');
const helpRoutes = require('./routes/helpRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));         
app.use(express.urlencoded({ limit: '10mb', extended: true }));  


app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/pets', adoptRoutes);
app.use('/api/help', helpRoutes);

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/home4paws', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"));


app.listen(5000, () => console.log(`Server running on port ${process.env.PORT}`));
