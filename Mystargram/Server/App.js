const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const multer = require("multer");

const app = express();
app.set("port", process.env.PORT || 5000);
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
  })
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/upimg", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

const memberRouter = require("./routers/members");
const userRouter = require("./routers/user");
app.use("/members", memberRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>MyStarGram</h1>");
});

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("폴더를 생성함");
  fs.mkdirSync("uploads");
}

const uploadObj = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/fileupload", uploadObj.single("image"), (req, res) => {
  res.send({ savefilename: req.file.filename, image: req.file.originalname });
});

app.listen(app.get("port"), () => {
  console.log(":::", app.get("port"), "port Server Open :::");
});
