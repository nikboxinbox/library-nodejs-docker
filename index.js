const express = require("express");
const { title } = require("process");
const Book = require("./models/Book");
store = {
    books: []
};
// create test data
["book1", "book2", "book3"].map((book) => {
    const title = book;
    const newBook = new Book(title);
    store.books.push(newBook);
});
console.log(store);
