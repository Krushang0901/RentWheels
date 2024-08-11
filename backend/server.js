const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const Image = require('./models/Image');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Increase request size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/booking', bookingRoutes);

app.get('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.set('Content-Type', image.contentType);
    res.send(Buffer.from(image.imageBase64, 'base64'));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
