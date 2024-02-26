const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
   if (!doesExist(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "You have successfully registered. You may now log in."});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username) => {
    let samenameusers = users.filter((user) => {
        return user.username === username
    });
if (samenameusers.length > 0) {
    return true;
} else {
    return false;
}
}

// Get the book list available in the shop
public_users.get('/books',(req, res) => {
    const get_books = new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify({books},null,4)));
    });
    get_books.then(() => console.log("Promise for task 10 resolved!"));
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res) {
    const getbooks_isbn = new Promise((resolve, reject)=>{
        const isbn = req.params.isbn;
        if (req.params.isbn <= 10){
            resolve(res.send(books[isbn]));
        } else {
            reject(res.send("Cannot find book by ISBN."));
        }
    });
    getbooks_isbn.then(function () { 
        console.log("Promise for task 11 resolved!");
    }).catch(function () { 
console.log("Book cannot be found by ISBN.");
    });
});

// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {

const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
if(books[isbn]["author"] === req.params.author) {
    booksbyauthor.push({"isbn":isbn,
"title":books[isbn]["title"],
"reviews":books[isbn]["reviews"]});
resolve(res.send(JSON.stringify({booksbyauthor},null,4)));
}
    });
    reject(res.send("Cannot find book by author."));
});
get_books_author.then(function() {
console.log("Promise for task 12 resolved!");
}).catch(function() {
console.log("Cannot find book by author.");
});
});

// Get all books based on title
public_users.get('/books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
    "author":books[isbn]["author"],
    "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle},null,4)));
    }
        });
        reject(res.send("Cannot find book by title."));
    });
    get_books_title.then(function() {
    console.log("Promise for task 12 resolved!");
    }).catch(function() {
    console.log("Cannot find book by title.");
    });
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res){
  const isbnParam = req.params.isbn;
  const reviews = books[isbnParam]["reviews"];
  if (!reviews) {
    return res.status(404).json({message: "No reviews have been submitted yet!"});
  } else {
    return res.status(200).json(reviews);
  }
});

module.exports.general = public_users;
