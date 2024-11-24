const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = ['image/jpeg', 'image/png']; 
    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new Error('Only JPG and PNG files are allowed'), false);
    }
    cb(null, true); 
  },
});

module.exports = upload;
