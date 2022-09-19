const multer = require('multer');

function uploadFile() {
  const storage = multer.diskStorage({
    destination : './public/files',
    filename: function (_req, file, cb){
      let extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
      cb(null, Date.now() + extension);
    }
  })

  const upload = multer({ storage: storage}).single('file')

  return upload;
}

module.exports = uploadFile;
