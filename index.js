const express = require("express");
const bodyParser = require("body-parser");
const Book = require("./models/Book");
const mongoose = require("mongoose");

// const loggerMiddleware = require("./middleware/logger");
const errorMiddleware = require("./middleware/error");
const internalServerErrorMiddleware = require("./middleware/internalServerError");

const indexRouter = require("./routes/index");
const booksApiRouter = require("./routes/api/bookRoutes");
const booksRouter = require("./routes/bookRoutes");
const userRouter = require("./routes/user");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

// app.use(loggerMiddleware);
// благодаря express.static  можно получить файл, просто введя в строку  hthttp://localhost:3000/public-files/public/img/имя файла.расширение
app.use("/public-files", express.static(__dirname + "/public"));
app.use("/api/user", userRouter);

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/api/books", booksApiRouter);

app.use(errorMiddleware);
app.use(internalServerErrorMiddleware);

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || "root";
const PasswordDB = process.env.DB_PAWORD || "qwerty12345";
const NameDB = process.env.DB_Name || "books";
const HostDb = process.env.DB_HOST || "mongodb://localhost:27017/";

async function start() {
  try {
    await mongoose.connect(HostDb, {
      user: UserDB,
      pass: PasswordDB,
      dbName: NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is running, go to http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
