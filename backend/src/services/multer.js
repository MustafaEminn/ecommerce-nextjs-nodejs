const multer = require("multer");

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
  filename: (req, file, cb) => {
    var date = new Date().toLocaleDateString("tr").replace(".", "_");
    cb(
      null,
      date +
        "-" +
        generateRandomIntegerInRange(1, 9) +
        "-" +
        file.originalname.replace(" ", "_").replace("-", "_")
    );
  },
});

var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([{ name: "productPhoto", maxCount: 10 }]);

module.exports = uploadMultiple;
