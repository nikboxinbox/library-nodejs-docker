const express = require("express");
const router = express.Router();
const request = require("request");
const fileMiddleware = require("../middleware/file");
const Book = require("../models/book-schema");
const PORT = process.env.PORT || 3000;

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

router.post("/create", async (req, res) => {
  // const { books } = store;
  // const { file } = req;
  // const fileName = file.originalname;
  // const fileBook = file.path;
  const { title, description } = req.body;
  const newBook = new Book({ title, description });

  try {
    await newBook.save();
    res.redirect("/books");
  } catch (error) {
    console.error(error);
  }
  // books.push(newBook);
});

// Получить все книги
router.get("/", async (req, res) => {
  const books = await Book.find();
  // const { books } = store;
  res.render("books/index", {
    title: "Books",
    books: books,
  });
});

// Получить книгу по **id**
router.get("/:id", async (req, res) => {
  // const { books } = store;
  const { id } = req.params;
  let counter = 0;
  let book;
  try {
    book = await Book.findById(id);
  } catch (error) {
    console.error(error);
    res.status(404).redirect("/404");
  } // const idx = books.findIndex((book) => book.id === id);
  res.render("books/view", {
    id: book.id,
    title: book.title,
    description: book.description,
    fileBook: book.fileBook,
    counter: counter,
  });
  // if (idx !== -1) {
  //   request
  //     .post(
  //       { url: `http://localhost:4000/counter/${id}/incr` },
  //       (err, response, body) => {
  //         if (err) return response.status(500).send({ message: err });
  //       }
  //     )
  //     .on("response", (response) => {
  //       request.get(
  //         { url: `http://localhost:4000/counter/${id}` },
  //         (err, r, body) => {
  //           if (err) return r.status(500).send({ message: err });
  //           counter = JSON.parse(body).counter;
  //           res.render("books/view", {
  //             id: books[idx].id,
  //             title: books[idx].title,
  //             description: books[idx].description,
  //             fileBook: books[idx].fileBook,
  //             counter: counter,
  //           });
  //         }
  //       );
  //     });
  // } else {
  //   res.status(404).json("book | not found");
  // }
});

// Редактируем книгу по **id**
router.get("/update/:id", async (req, res) => {
  // const { books } = store;
  const { id } = req.params;
  let book;
  try {
    book = await Book.findById(id);
    console.log("ASSSSSSSSSSSSSSSSSSSSS", book);
  } catch (error) {
    console.error(error);
    res.status(404).redirect("/404");
  }
  res.render("books/update", {
    // TODO: Дописать , передать в шаблон все данные книги по свойствам
    title: "Update Book",
    book: book,
  });
  // const idx = books.findIndex((book) => book.id === id);
  // if (idx !== -1) {
  //   res.render("books/update", {
  //     title: "Update Book",
  //     book: books[idx],
  //   });
  //   // res.json(books[idx]);
  // } else {
  //   res.status(404).json("book | not found");
  // }
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
