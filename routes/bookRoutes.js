const express = require("express");
const router = express.Router();
const fileMiddleware = require("../middleware/file");
const Book = require("../models/Book");

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
// Создаём книгу

router.get("/create", (req, res) => {
  res.render("books/create", {
    title: "Create Book",
    book: {},
  });
});

router.post("/create", (req, res) => {
  const { books } = store;
  // const { file } = req;
  const { title, description } = req.body;
  // const fileName = file.originalname;
  // const fileBook = file.path;

  const newBook = new Book({ title, description });

  books.push(newBook);
  res.redirect("/books");
});

// Получить все книги
router.get("/", (req, res) => {
  const { books } = store;
  res.render("books/index", {
    title: "Books",
    books: books,
  });
});

// Редактируем книгу по **id**
router.get("/update/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    res.render("books/update", {
      title: "Update Book",
      book: books[idx],
    });
    // res.json(books[idx]);
  } else {
    res.status(404).json("book | not found");
  }
});

router.post("/update/:id", (req, res) => {
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
    res.redirect("/books");
  } else {
    res.status(404).json("book | not found");
  }
});

// Удалить книгу по **id**
router.post("/delete/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const idx = books.findIndex((book) => book.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.redirect("/books");
  } else {
    res.status(404).json("book | not found");
  }
});

module.exports = router;
