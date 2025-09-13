const multer = require("multer");
const path = require("path");

const storage =  multer.diskStorage({
    destination: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      if (ext === ".pdf" || ext === ".docx" || ext === ".doc" || ext === ".xlsx" || ext === ".xls" || ext === ".csv"||
         ext === ".txt" || ext === ".rtf" || ext === ".csv" || ext === ".odt" || ext === ".ods" || ext === ".csv"|| 
         ext === ".html" || ext === ".htm" || ext === ".xml" || ext === ".md") {
        cb(null, path.join(__dirname, "../public/documents"));
        return;
      }
      else cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      if (ext === ".pdf" || ext === ".docx" || ext === ".doc" || ext === ".xlsx" || ext === ".xls" || ext === ".csv"||
        ext === ".txt" || ext === ".rtf" || ext === ".csv" || ext === ".odt" || ext === ".ods" || ext === ".csv"|| 
        ext === ".html" || ext === ".htm" || ext === ".xml" || ext === ".md") {
        cb(
          null,
          "Doc" +
            "_" +
            Math.floor(Math.random() * Date.now()).toString(16) +
            path.extname(file.originalname)
        );
        return;
      }
      else cb(
        null,
        "Img" +
          "_" +
          Math.floor(Math.random() * Date.now()).toString(16) +
          path.extname(file.originalname)
      );;
    },
  });

module.exports = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // Limite à 20 Mo
});