import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    console.log(file);

    const fileExt = path.extname(file.originalname);

    console.log({ file, fileExt });

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "local" + "-" + uniqueSuffix + fileExt);
  },
});

export const uploadDiskStorage = multer({ storage: storage });
{
  /* <img src="http://localhost:3069/images/local-1773543007603-755926211.jpg"></img>; */
}
