const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post");
const expressValidator = require("express-validator");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());

//router middleware
app.use("/api/v1", postRoutes);
app.use("/api/v1", authRoutes);


//db
const dbConnect = () => {
    mongoose.connect(process.env.CONNECTION_URI)
        .then(() => console.log("Db connected"))
        .catch(err => console.log(err.message));

}

dbConnect();
mongoose.connection.on("error", (err) => console.log(err));




app.listen(PORT, () => console.log(`Server started successfully on: ${PORT}`))