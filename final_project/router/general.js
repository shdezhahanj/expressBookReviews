const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.send(JSON.stringify(book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const bookIds = Object.keys(books);
  const matches = [];
  for (const id of bookIds) {
    const book = books[id];
    if (book && book.author === author) {
      matches.push({ isbn: id, ...book });
    }
  }
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found for the given author" });
  }
  return res.send(JSON.stringify(matches, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const bookIds = Object.keys(books);
  const matches = [];
  for (const id of bookIds) {
    const book = books[id];
    if (book && book.title === title) {
      matches.push({ isbn: id, ...book });
    }
  }
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found for the given title" });
  }
  return res.send(JSON.stringify(matches, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
