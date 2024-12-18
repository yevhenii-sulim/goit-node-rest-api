import multer from "multer";
import path from "node:path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const limits = 5 * 1024 * 1024;

const upLoad = multer({ storage: storage, limits });

export default upLoad;
