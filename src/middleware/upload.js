const multer = require('multer');
const path = require('path');

const upload = multer({
    storage:multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, path.join(__dirname,'..','uploads'));
        },
        filename: function(req, file, cb) {
          cb(null, new Date().toISOString() + file.originalname);
        }
      })
})

module.exports = upload;