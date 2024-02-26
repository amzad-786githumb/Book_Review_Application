const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let validuser = users.filter((user)=>{
    return user.username === username
});
if (validuser.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ 
    let authuser = users.filter((user)=>{
        return (user.username === username && user.password === password)//returns boolean
//write code to check if username and password match the one we have in records.
    });
    if (authuser.length > 0) {
return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Unable to log in."});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign ({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
accessToken,username
    } 
    return res.status(200).json({message: "User successfully logged in!"});
    } else { 
        return res.status(208).json({message: "Invalid log in credentials. Check username or password."});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  if (filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];
if (review) {
    filtered_book['reviews'][reviewer] = review;
    books[isbn] = filtered_book;
}
res.send(`Your review for ${isbn} has been submitted!`);
  } else {
    res.send("Cannot submit review as unable to find book by ISBN.");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {    
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];
    
    if (!username) {
        return res.status(403).json({message: "User not authenticated."});
    }

    if (book) {
        if (book.reviews.hasOwnProperty(username)) {

            delete book.reviews[username];
            return res.status(200).json({message: "Review has been successfully deleted."});
        } else {
            return res.status(404).json({message: "Cannot find book review."});
        }
    } else {
        return res.status(404).json({message: "Invalid ISBN."});
    }
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
