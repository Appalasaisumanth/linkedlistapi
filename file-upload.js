const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// MIME type map for allowed file types
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'application/pdf': 'pdf' // Support for PDFs
};

// Function to ensure that the destination folder exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer configuration
const fileUpload = multer({
  limits: { fileSize: 10*1024*1024*10000 }, // Set file size limit to 500KB
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // Get file extension based on MIME type
      let folderPath;

      // Choose folder based on file type (images vs PDFs)
      if (ext === 'pdf') {
        folderPath = path.join(__dirname, '../my-app/public/uploads/pdfs'); // PDF folder
      } else {
        folderPath = path.join(__dirname, '../my-app/public/uploads/images'); // Image folder
      }

      ensureDirectoryExists(folderPath); // Ensure the folder exists

      cb(null, folderPath); // Set only the destination path
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // Get file extension
      const filename = `${uuidv4()}.${ext}`; // Create filename as uuid+ext (NO PATH)
      cb(null, filename); // Set only the file name, no path included
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Check if MIME type is valid
    let error = isValid ? null : new Error('Invalid mime type!'); // Handle invalid types
    cb(error, isValid);
  }
});

module.exports = fileUpload;
