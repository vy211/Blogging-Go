const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const auth = require("./Routes/auth.js");
const post = require("./Routes/post.js");
const profile = require("./Routes/profile.js");
const db = require("./Database/db.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(express.json()); //For parsing the payloads
//when passing credentials we need set up additional properties
//app.use(cors({ credentials: true, origin: "" }));
const allowedOrigins = ["https://blogging-go.onrender.com", "http://localhost:4000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(cookieParser());
const jwt = require("jsonwebtoken");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client", "build")));
console.log(path.join(__dirname, "../client", "build"));
//It is used to suppress the warnings given by mongoose
//At this point even i don't know what those warnings meant
//so i just suppressed them (May be i'look onto them in future!)
mongoose.set("strictQuery", true);

//connecting to our database
db();

//Routing for login and register
app.use("/auth", auth);

//Routing for posts related operations
app.use("/post", post);

app.use("/profile", profile);

app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});
app.listen(process.env.PORT || 4000, () => {
  console.log(`server is listening at port ${process.env.PORT}...`);
});
