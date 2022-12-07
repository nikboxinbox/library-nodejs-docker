const express = require("express");
const router = express.Router();
const fs = require("fs");
const fileMiddleware = require("../../middleware/file");
const Book = require("../../models/Book");

const store = {
  books: [],
};
// create test data
["book1", "book2", "book3"].map((book) => {
  const title = book;
  const description = "test";
  const fileName = `${book}-file-name`;
  const fileBook = `public/bookFiles/test_data/${book}.jpeg`;

  const newBook = new Book({ title, description, fileName, fileBook });

  store.books.push(newBook);
});

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

  const newBook = new Book({ title, description, fileName, fileBook });

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

router.get("/:id/download-file", (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.find((book) => book.id === id);

  if (book) {
    res.download(
      __dirname + `../../../${book.fileBook}`,
      `${book.fileName}`,
      (err) => {
        if (err) {
          console.error("Error book file download", err);
          res.status(404).json();
        }
      }
    );
  } else {
    res.status(404).json("book | not found");
  }
});

module.exports = router;
