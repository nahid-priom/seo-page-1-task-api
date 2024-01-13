import express from 'express'
import mongoose from 'mongoose';
import multer from 'multer';
const app = express();
const port = 3001;

mongoose.connect('mongodb+srv://priomgithub:DXZjKYj6OcPSsZXY@cluster0.w5f8r9l.mongodb.net/?retryWrites=true&w=majority', {
  ...(parseInt(mongoose.version) < 4
    ? { useNewUrlParser: true, useUnifiedTopology: true }
    : {}),
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const Attachment = mongoose.model('Attachment', {
  fileName: String,
  fileData: Buffer,
  fileType: String,
});


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const newAttachment = new Attachment({
      fileName: file.originalname,
      fileData: file.buffer,
      fileType: file.mimetype,
    });
    await newAttachment.save();
    res.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.get('/api/attachmentCount', async (req, res) => {
  try {
    const count = await Attachment.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
