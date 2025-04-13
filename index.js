require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error:', err));

// Schema for file metadata
const FileMeta = mongoose.model('FileMeta', new mongoose.Schema({
  title: String,
  description: String,
  azureBlobName: String,
  blobUrl: String,
  originalName: String,
  uploadDate: { type: Date, default: Date.now }
}));

// Multer setup (in-memory)
const upload = multer({ storage: multer.memoryStorage() });

// Azure Blob setup
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);

// Upload route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { title, description } = req.body;

    if (!file) return res.status(400).json({ message: 'No file uploaded.' });

    // Create a unique name for the blob
    const blobName = Date.now() + '-' + file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file to Azure Blob
    await blockBlobClient.uploadData(file.buffer);

    const blobUrl = blockBlobClient.url;

    // Save metadata in MongoDB
    const meta = new FileMeta({
      title,
      description,
      azureBlobName: blobName,
      blobUrl,
      originalName: file.originalname
    });

    await meta.save();

    res.json({ message: '✅ File uploaded successfully.', url: blobUrl });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});