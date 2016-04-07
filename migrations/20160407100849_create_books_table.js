

exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments();
    table.string('title');
    table.integer('firstAuthor_id').references('id').inTable('authors');
    table.integer('secondAuthor_id').references('id').inTable('authors');
    table.integer('thirdAuthor_id').references('id').inTable('authors');
    table.string('description', 2000);
    table.string('cover_url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
