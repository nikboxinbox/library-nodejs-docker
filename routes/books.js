const express = require("express");
const router = express.Router();
const fs = require("fs");
const Book = require("../models/Book");
const fileMiddleware = require("../middleware/file");
// const formData = require("express-form-data");
// const app = express();
// app.use("/", router); // Load the router module
// app.use(formData.parse());

store = {
  books: [],
};

// create test data
["book1", "book2", "book3"].map((book) => {
  const title = book;
  const description = "test";
  const newBook = new Book(title, description);
  store.books.push(newBook);
});

// Для теста обработчика ошибок
router.get("/err", (req, res) => {
  // console.log("ASSS_GET_ERROR_ROUTER");
  throw new Error("error msg");
});

// Получить все книги
router.get("/", (req, res) => {
  const { books } = store;
  res.json(books);
});
// Получить книгу по **id**
router.get("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404).json("book | not found");
  }
});

// Создаём книгу
router.post("/", (req, res) => {
  // console.log("ASSS", req.body);
  const { books } = store;
  const { title, description } = req.body;
  const newBook = new Book(title, description);
  books.push(newBook);
  res.status(201).json(newBook);
});

// Редактируем книгу по **id**
router.put("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const { title, description } = req.body;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
    };
    res.json(books[idx]);
  } else {
    res.status(404).json("book | not found");
  }
});

// Удалить книгу по **id**
router.delete("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
    res.json(true);
  } else {
    res.status(404).json("book | not found");
  }
});

// Загрузка файлов
router.post("/upload-img", fileMiddleware.single("cover-img"), (req, res) => {
  console.log("FUCKKK_UPLOAD");
  if (req.file) {
    const { path } = req.file;
    console.log(path);
    res.json(path);
  } else {
    res.json(null);
  }
});
//TODO: пока для теста на скачивание изображение А верное именование и хранение файлов книг еще не реализовано
router.get("/:id/download-img", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    // res.download(путь до файла, имя с которым файл будет скачиваться, обработка ошибки)
    res.download(
      __dirname + "/../public/img/demo.jpeg",
      "cover.jpeg",
      (err) => {
        if (err) {
          res.status(404).json();
        }
      }
    );
  } else {
    res.status(404).json("book | not found");
  }
});

module.exports = router;
