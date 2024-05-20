const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

cloudinary.config({
  cloud_name: 'dwdalarn6',
  api_key: '114328875713679',
  api_secret: 'P8gH7w4q_RILTXbCc-r-jXggXEI'
});

mongoose.connect('mongodb+srv://bibek:bibek111@cluster0.gaaho0t.mongodb.net/productsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  category: String,
  imageUrl: String,
  productDescription: String,
  rating: Number,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testing',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const { category, productDescription, rating, price } = req.body;
  const imageUrl = req.file.path;

  const newProduct = new Product({
    category,
    imageUrl,
    productDescription,
    rating,
    price,
  });

  try {
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
