const Book = require("../models/Book");

const store = {
  books: [],
};

// create test data
["book1", "book2", "book3"].map((book) => {
  const title = book;
  const description = "test";
  const newBook = new Book(title, description);
  store.books.push(newBook);
});
module.exports = store;
