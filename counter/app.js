const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const PORT = 4000;

let counter = 0;
// respond with "hello world" when a GET request is made to the homepage
app.post("/counter/:id/incr", (req, res) => {
    const { id } = req.params;
    if (!fs.existsSync("counterStore.json")) {
        const books = [{ id: id, counter: 1 }];
        fs.writeFile("counterStore.json", JSON.stringify(books), (err) => {
            if (err) console.log(err);
        });
    } else {
        const books = require("./counterStore");
        const idx = books.findIndex((book) => book.id === id);
        if (idx !== -1) {
            books[idx].counter++;
        } else {
            books.push({ id: id, counter: 1 });
        }
        // console.log(books[0].id);
        fs.writeFile("counterStore.json", JSON.stringify(books), (err) => {
            if (err) console.log(err);
        });
    }
    counter = counter + 1;
    res.send(`${counter}`);
});

app.get("/counter/:id/", (req, res) => {
    const { id } = req.params;
    if (!fs.existsSync("counterStore.json")) {
        res.send({ counter: 0 });
    }
    const books = require("./counterStore");
    const idx = books.findIndex((book) => book.id === id);
    if (idx !== -1) {
        res.send({ counter: books[idx].counter });
    } else {
        res.send({ counter: 0 });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running, go to http://localhost:${PORT}`);
});
