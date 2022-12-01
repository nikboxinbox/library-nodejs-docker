const express = require("express");
const bodyParser = require("body-parser");
const Book = require("./models/Book");

const loggerMiddleware = require("./middleware/logger");
const errorMiddleware = require("./middleware/error");
const internalServerErrorMiddleware = require("./middleware/internalServerError");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/bookRoutes");
const userRouter = require("./routes/user");

const app = express();



app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(loggerMiddleware);
// благодаря express.static  можно получить файл, просто введя в строку  hthttp://localhost:3000/public-files/public/img/имя файла.расширение
app.use("/public-files", express.static(__dirname + "/public"));
app.use("/api/user", userRouter);
// Здесь ("/api/books")мы указываем общее начало для всех роутов которые описаны в routes/books . А в books уже индивидульные окончания на каждый запрос
app.use("/api/books", booksRouter);
app.use("/", indexRouter);
app.use(errorMiddleware);

app.use(internalServerErrorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running, go to http://localhost:${PORT}`);
});
