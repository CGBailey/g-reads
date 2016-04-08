var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);
/* GET home page. */



var getPics = function() {
  var authPic
  var bookPic
  return knex('authors').where({id: 1})
  .then(function(author) {
    authPic = author.portrait_url
    return knex('books').where({id: 6})
    .then(function(book) {
      bookPic = book.cover_url
      return {
        portrait: authPic,
        cover: bookPic
      }
    })
  });
};


router.get('/', function(req, res, next) {
  getPics()
  .then(function(pictures){
    res.render('index', { portait: pictures.portrait, cover: pictures.cover })
  })
});


/*
//--- view
  h1= book.title
  - book.authors.forEach do |author|
    h2= author.name
//-----
var result = [
  { // book
    title: "...",
    genre: "...",
    description: "...",
    authors: [
      {
        name: "..."
      },
      {
        // ....
      }
    ]
  },
  {
    // ...
  }
]

*/


router.get('/books', function(req, res, next) {
  knex('bibs')
  .innerJoin('books', 'bibs.book_id', 'books.id')
  .innerJoin('genres', 'books.genre_id', 'genres.id')
  .innerJoin('authors', 'bibs.author_id', 'authors.id')
  .then(function(rs) {
    var result = [];
    var currentBook = null;
    rs.forEach(function(row) {
      if (!currentBook) {
          // here is first book
          currentBook = {
            id: row.book_id,
            title: row.title,
            authors: [],
            genre: row.genre_name,
            description: row.description
          };
      } else if (row.book_id != currentBook.id) {
          // here is an additional book
          result.push(currentBook);
          currentBook = {
            id: row.book_id,
            title: row.title,
            authors: [],
            genre: row.genre_name,
            description: row.description
          };
      }
      // here is an author
      currentBook.authors.push({name: row.author_firstNamename + row.author_lastName})
    })
    return result
  })
  .then(function(resos) {
    console.log(resos)
    res.render('books', { display: resos })
  })
});

router.get('/books/new', function(req, res, next) {
  knex.select('id', 'author_firstName', 'author_lastName').from('authors')
  .then(function(rs){
    console.log(rs);
    res.render('newBook', { authors: rs})
  })
});

router.post('/books/new', function(req, res, next) {
  var newBook = req;
  var oGenre
  if(knex('genre').where({genre_name: newBook.genre})) {

  }
  knex('books').insert({title: newBook.title, description: newBook.description, cover_url: newBook.cover})
  .then(function(rs){
    res.render('newBook', { authors: rs.author_firstName+rs.author_lastName })
  })
});

router.get('/books/:id', function(req, res, next) {
  knex('bibs')
  .where({'bibs.book_id': req.params.id})
  .innerJoin('books', 'bibs.book_id', 'books.id')
  .innerJoin('genres', 'books.genre_id', 'genres.id')
  .innerJoin('authors', 'bibs.author_id', 'authors.id')
  .then(function(rs) {
    var result = [];
    var currentBook = null;
    rs.forEach(function(row) {
      if (!currentBook) {
          // here is first book
          currentBook = {
            id: row.book_id,
            title: row.title,
            authors: [],
            genre: row.genre_name,
            description: row.description,
            image: row.cover_url
          };
      } else if (row.book_id != currentBook.id) {
          // here is an additional book
          result.push(currentBook);
          currentBook = {
            id: row.book_id,
            title: row.title,
            authors: [],
            genre: row.genre_name,
            description: row.description,
            image: row.cover_url
          };
      }
      // here is an author
      currentBook.authors.push({name: row.author_firstNamename + row.author_lastName})
    })
    return result
  })
  .then(function(resos) {
    console.log(resos)
    res.render('books', { display: resos })
  })
});

router.post('/books/:id/delete', function(req, res, next) {
  knex('books').where({id: req.params.id}).delete()
  .then(function(){
  knex('bibs').where({book_id: req.params.id}).delete()
  .then(function(){
    res.redirect('/')
  })
  })
});

router.get('/books/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit book' });
});

router.post('/books/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit book' });
});

router.get('/authors', function(req, res, next) {
  knex('bibs')
  .innerJoin('books', 'bibs.book_id', 'books.id')
  .innerJoin('genres', 'books.genre_id', 'genres.id')
  .innerJoin('authors', 'bibs.author_id', 'authors.id')
  .then(function(rs) {
    var result = [];
    var currentAuthor = null;
    rs.forEach(function(row) {
      if (!currentAuthor) {
          // here is first book
          currentAuthor = {
            id: row.author_id,
            name: row.author_firstName+row.author_lastName,
            books: [],
            bio: row.bio,
            image: row.portrait_url
          };
      } else if (row.author_id != currentAuthor.id) {
          // here is an additional book
          result.push(currentAuthor);
          currentAuthor = {
            id: row.book_id,
            name: row.author_firstName+row.author_lastName,
            books: [],
            bio: row.bio,
            image: row.portrait_url
          };
      }
      // here is an author
      currentAuthor.books.push({title: row.title})
    })
    return result
  })
  .then(function(resos) {
    console.log(resos)
    res.render('authors', { display: resos })
  })
});

router.get('/authors/new', function(req, res, next) {
  knex.select('id','title').from('books')
  .then(function(rs){
    console.log(rs);
    res.render('newAuthor', { books: rs})
  })
});

router.post('/authors/new', function(req, res, next) {

 knex.select('id').from('books').whereIN(id, req.books)
 .then(function(aBooks){
   var bId = aBooks;
   knex('authors').returning('id').insert({author_firstName: req.firstName, author_lastName: req.lastName, bio: req.bio, portrait_url: req.portrait})
   .then(function(entry) {
     knex('bibs').insert({book_id: abooks, author_id: entry})
   })
 })
});

router.get('/authors/:id', function(req, res, next) {
  knex('bibs')
  .where({'bibs.author_id': req.params.id})
  .innerJoin('books', 'bibs.book_id', 'books.id')
  .innerJoin('genres', 'books.genre_id', 'genres.id')
  .innerJoin('authors', 'bibs.author_id', 'authors.id')
  .then(function(rs) {
    var result = [];
    var currentAuthor = null;
    rs.forEach(function(row) {
      if (!currentAuthor) {
          // here is first book
          currentAuthor = {
            id: row.author_id,
            name: row.author_firstName+row.author_lastName,
            books: [],
            bio: row.bio,
            image: row.portrait_url
          };
      } else if (row.author_id != currentAuthor.id) {
          // here is an additional book
          result.push(currentAuthor);
          currentAuthor = {
            id: row.book_id,
            name: row.author_firstName+row.author_lastName,
            books: [],
            bio: row.bio,
            image: row.portrait_url
          };
      }
      // here is an author
      currentAuthor.books.push({title: row.title})
    })
    return result
  })
  .then(function(resos) {
    console.log(resos)
    res.render('authors', { display: resos })
  })
});

router.post('/authors/:id/delete', function(req, res, next) {
  knex('authors').where({id: req.params.id}).delete()
  .then(function(){
  knex('bibs').where({author_id: req.params.id}).delete()
  .then(function(){
    res.redirect('/')
  })
  })
});

router.get('/authors/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit author' });
});

router.post('/authors/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit author' });
});

module.exports = router;
