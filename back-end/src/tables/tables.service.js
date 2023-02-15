const knex = require("../db/connection");

/**
 * SQL query to find all tables given a specific date
 */
function list(date) {
  return knex("tables").select().orderBy("table_name");
}

/**
 * SQL query to find a table given a specific ID
 */
function read(table_id) {
  return knex("tables").select().where({ table_id }).first();
}

/**
 * SQL query to create a new table
 */
function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((tableData) => tableData[0]);
}

/**
 * SQL query to seat a table
 */
function seat(table_id, reservation_id) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id })
      .update({ reservation_id })
      .returning("*")
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "seated" })
          .returning("*")
          .then((updatedRes) => updatedRes[0]);
      });
  });
}
/**
 * SQL query to unseat a table
 */
function unseat({ table_id, reservation_id }) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id })
      .update({ reservation_id: null })
      .returning("*")
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: `finished` })
          .returning("*")
          .then((tableData) => tableData[0]);
      });
  });
}
module.exports = {
  list,
  read,
  create,
  seat,
  unseat,
};