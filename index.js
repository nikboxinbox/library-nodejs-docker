const express = require("express");
const bodyParser = require("body-parser");
const Book = require("./models/Book");

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
app.listen(PORT, () => {
  console.log(`Server is running, go to http://localhost:${PORT}`);
});
