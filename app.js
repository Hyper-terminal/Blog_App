const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post");
const expressValidator = require("express-validator");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(cors());

//router middleware
app.use("/api/v1", postRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

//express token error handler middleware
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({error: "You are not authorized to perform this action!!!"});
    } else {
        next(err);
    }
});


// api docs
app.get("/docs", (req, res)=> {
  fs.readFile("docs/apiDocs.json", (err, result)=> {
    if(err){
      return res.status(400).json({err});
    }else{
      let docs = JSON.parse(result);
      res.json(docs);
    }
  })
})

//db
const dbConnect = () => {
    mongoose.connect(process.env.CONNECTION_URI)
        .then(() => console.log("Db connected"))
        .catch(err => console.log(err.message));

}

dbConnect();
mongoose.connection.on("error", (err) => console.log(err));




app.listen(PORT, () => console.log(`Server started successfully on: ${PORT}`))
