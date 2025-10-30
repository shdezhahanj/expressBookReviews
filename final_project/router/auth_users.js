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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
