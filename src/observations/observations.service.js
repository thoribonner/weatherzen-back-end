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

module.exports = {
  create,
  list,
  read,
  update,
};
