

exports.up = function(knex, Promise) {
  return knex.schema.createTable('authors', function(table) {
    table.increments();
    table.string('author_firstName');
    table.string('author_lastName');
    table.string('bio', 2000);
    table.string('portrait_url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors');
};
