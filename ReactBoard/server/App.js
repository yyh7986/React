const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:"abcd",
}));
app.set("port", process.env.PORT || 5000);
app.use("/img", express.static(path.join(__dirname, "uploads")));

const memberRouter = require("./Routers/members");
const boardRouter = require("./Routers/boards");
app.use("/members", memberRouter);
app.use("/boards", boardRouter);

app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});


app.listen(app.get("port"), () => {
  console.log(":::", app.get("port"), "port Server Open :::");
});
