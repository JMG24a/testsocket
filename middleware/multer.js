const multer = require('multer');

function uploadFile() {
  const storage = multer.diskStorage({
    destination : './public/files',
    filename: function (_req, file, cb){
      let extension = file.mimetype.slice(file.mimetype.lastIndexOf('/'))
      extension = extension.replace('/', '')
      cb(null, Date.now() + '.' + extension);
    }
  })

  const upload = multer({ storage: storage}).single('file')

  return upload;
}

module.exports = uploadFile;
