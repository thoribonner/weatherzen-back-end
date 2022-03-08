
exports.up = function(knex) {
  return knex.schema.table('observations', table => {
    table.decimal('air_temperature', null)
    table.string('air_temperature_unit', 1)
  })
};

exports.down = function(knex) {
  return knex.schema.table('observations', table => {
    table.dropColumn('air_temperature')
    table.dropColumn('air_temperature_unit')
  })
};
