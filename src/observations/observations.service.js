const knex = require("../db/connection");

function create(newObservation) {
  return knex("observations").insert(newObservation).returning("*");
}

function list() {
  return knex("observations").select("*");
}

function read(observation_id) {
  return knex("observations").select("*").where({ observation_id }).first();
}

function update(updatedObservation) {
  return knex("observations")
    .select("*")
    .where({ observation_id: updatedObservation.observation_id })
    .update(updatedObservation, "*");
}

function destroy(observation_id) {
  return knex('observations').where({observation_id}).del();
}

module.exports = {
  create,
  delete: destroy,
  list,
  read,
  update,
};
