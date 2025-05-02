const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(__dirname));

const uploadDir = path.join(__dirname, 'upload_images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Created directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using current timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    // Example: imageFile-1678886400000-123456789.jpg
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10
  }
}).single('uploadedImage');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(400).json({ message: err.message || 'File upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    console.log('File uploaded successfully:', req.file.filename);
    res.status(200).json({
      message: 'File uploaded successfully!',
      filename: req.file.filename
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Uploading files to: ${uploadDir}`);
});
