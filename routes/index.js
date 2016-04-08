var express = require('express');
var router = express.Router();

/* GET home page. */



var getPics = function() {
  var authPic
  var bookPic
  return knex('authors').where({id: 1})
  .then(function(author) {
    authPic = author.portrait_url
    return knex('books').where({id: 6})
    .then(book) {
      bookPic = book.cover_url
      return {
        portrait: authPic,
        cover: bookPic
      }
    }
  })
}


router.get('/', function(req, res, next) {
  getPics()
  .then(function(pictures){
    res.render('index', { portait: pictures.portrait, cover: pictures.cover })
  })
});



router.get('/books', function(req, res, next) {
  knex('bibs')
  .innerJoin('books', 'bibs.book_id', 'books.id')
  .innerJoin('genres', 'books.genre_id', 'genres.id')
  .innerJoin('authors', 'bibs.author_id', 'authors.id')
  res.render('index', { title: 'books' });
});

router.get('/books/new', function(req, res, next) {
  res.render('index', { title: 'new book' });
});

router.get('/books/:id', function(req, res, next) {
  res.render('index', { title: 'book'+req.params.id });
});

router.post('/books/:id/delete', function(req, res, next) {
  res.render('index', { title: 'delete book' });
});

router.get('/books/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit book' });
});

router.post('/books/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit book' });
});

router.get('/authors', function(req, res, next) {
  res.render('index', { title: 'authors' });
});

router.get('/authors/new', function(req, res, next) {
  res.render('index', { title: 'new author' });
});

router.post('/authors/new', function(req, res, next) {
  res.render('index', { title: 'new author' });
});

router.get('/authors/:id', function(req, res, next) {
  res.render('index', { title: 'author'+req.params.id });
});

router.post('/authors/:id/delete', function(req, res, next) {
  res.render('index', { title: 'delete author' });
});

router.get('/authors/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit author' });
});

router.post('/authors/:id/edit', function(req, res, next) {
  res.render('index', { title: 'edit author' });
});

module.exports = router;
