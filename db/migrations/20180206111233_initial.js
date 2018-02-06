
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('cameras', function(table){
      table.increments('id').primary();
      table.string('name');
      table.string('full_name');
      table.integer('rover_id');
      table.integer('nasa_id')

      table.timestamps(true, true);
    }),

    knex.schema.createTable('photos', function(table) {
      table.increments('id').primary();
      table.string('img_src');
      table.string('earth_date');
      table.integer('sol');
      table.integer('nasa_id');
      table.integer('cameras_id').unsigned()
      table.foreign('cameras_id')
        .references('cameras.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('photos'),
    knex.schema.dropTable('projects')
  ]);
};
