import express from "express";
import multer from "multer";
import path from "path";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  uploadUserAvatar,
} from "../controllers/userController.js";

const router = express.Router();

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/avatars");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 限制2MB
  fileFilter: function (req, file, cb) {
    // 只接受图片文件
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("只允许上传图片文件!"), false);
    }
    cb(null, true);
  },
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.post("/:id/avatar", upload.single("avatar"), uploadUserAvatar);

export default router;
