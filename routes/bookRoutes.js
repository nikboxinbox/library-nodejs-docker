const express = require("express");
const router = express.Router();
const fs = require("fs");
const fileMiddleware = require("../middleware/file");
const store = require("../store/bookStore");
const Book = require("../models/Book");

// Для теста обработчика ошибок
router.get("/err", (req, res) => {
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
router.post("/", fileMiddleware.single("book-img"), (req, res) => {
  const { books } = store;
  const { file } = req;

  const { title, description } = req.body;

  const fileName = file.originalname;
  const fileBook = file.path;
  console.log("FUCK", fileBook);

  const newBook = new Book(title, description, fileName, fileBook);

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
