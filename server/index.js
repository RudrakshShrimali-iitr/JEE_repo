const express = require('express');

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const mammoth = require('mammoth');
const { FileModel } = require('./models/file'); // Ensure correct path
const { extractTextFromDocx } = require('./utils/extraction');

const authrouter = require('./Routes/authroutes');
require('./models/user');
require('./models/db');

// Initialize the app
const app = express();

mongoose.connect('mongodb+srv://rudrakshs:rudrakshs@jee.bymdn.mongodb.net/UserNames')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

dotenv.config();

const PORT = process.env.PORT || 4000;
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Basic Backend Server is Running!');
});

app.use('/auth', authrouter);
// app.post('/auth', (req, res) => {
//     console.log(req.body); // Should print the received data
//     res.json({ message: 'User registered successfully' });
// });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;

    let extractedText = '';
    
    // Check if the uploaded file is a .docx file
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = fs.readFileSync(filePath); // Read file as buffer

      extractedText = await mammoth.extractRawText({ buffer })
        .then(result => result.value)
        .catch(err => {
          console.error('Mammoth extraction error:', err);
          return '';
        });
    }

    // Save file details to MongoDB
    const newFile = new FileModel({
      filename: req.file.filename,
      path: req.file.path,
      content: extractedText,
    });

    await newFile.save();

    res.json({ message: 'File uploaded & text extracted!', text: extractedText });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading or extracting file');
  }
});

// New endpoint to fetch questions
 app.get('/files', async (req, res) => {
  try {
    // Find the most recently uploaded file or the first one in the database
    const file = await FileModel.findOne()// Sort by creation date, latest first

    if (!file) {
      return res.status(404).send('No files found.');
    }

    res.json(
     file // Return extracted text
    );
  } catch (err) {
    console.error('Error fetching file:', err);
    res.status(500).send('Error fetching file.');
  }
});


// app.get('/')
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});//