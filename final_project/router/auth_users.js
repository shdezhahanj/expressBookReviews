const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Username is valid if it doesn't already exist
  if (!username) return false;
  return !users.some((u) => u && u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
// check if username and password match our records
  if (!username || !password) return false;
  return users.some((u) => u && u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  if (!req.session) {
    return res.status(500).json({ message: "Session not initialized" });
  }
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review is required as query parameter 'review'" });
  }

  const username = req?.session?.authorization?.username || req?.user?.username;
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  const isUpdate = Object.prototype.hasOwnProperty.call(book.reviews, username);
  book.reviews[username] = review;

  return res.status(200).json({
    message: isUpdate ? "Review updated" : "Review added",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
