
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments();
    table.integer('author_id').references('id').inTable('authors');
    table.integer('book_id').references('id').inTable('books');
  })
};

exports.down = function(knex, Promise) {

};
