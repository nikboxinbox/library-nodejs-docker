const express = require("express");

const Book = require("./models/Book");
const formData = require("express-form-data");
const app = express();
const router = express.Router();
app.use("/", router); // Load the router module
app.use(formData.parse());

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
// Получить все книги
router.get("/api/books", (req, res) => {
  const { books } = store;
  res.json(books);
});
// Получить книгу по **id**
router.get("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((book) => book.id === id);
  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404).json("book | not found");
  }
});

// Авторизация пользователя. TODO: сделать, пока просто заглушка
router.post("/api/user/login", (req, res) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

// Создаём книгу
router.post("/api/books", (req, res) => {
  console.log("ASSS", req.body);
  const { books } = store;
  const { title, description } = req.body;
  const newBook = new Book(title, description);
  books.push(newBook);
  res.status(201).json(newBook);
});

// Редактируем книгу по **id**
router.put("/api/books/:id", (req, res) => {
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
router.delete("/api/books/:id", (req, res) => {
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running, go to http://localhost:${PORT}`);
});
