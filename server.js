const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: 'visionbuilder_uploads'
    });
    fs.unlinkSync(filePath);
    res.json({ imageUrl: uploadResult.secure_url });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024"
    });

    const image_url = response.data[0]?.url;
    res.json({ text: `Generated for prompt: "${prompt}"`, image_url });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));