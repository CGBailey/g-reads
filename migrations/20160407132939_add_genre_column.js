
exports.up = function(knex, Promise) {
  return knex.schema.createTable('genres', function(table){
    table.increments();
    table.string('genre_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('genres');
};
