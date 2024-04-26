const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Here you could save the file to cloud storage or serve it directly
  // For this example, we'll just return a URL
  const url = `data:application/pdf;base64,${file.buffer.toString('base64')}`;
  res.json({ success: true, url });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
