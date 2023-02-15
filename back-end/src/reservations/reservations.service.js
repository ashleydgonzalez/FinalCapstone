const knex = require("../db/connection");

/**
 * SQL query to find all reservations on a given date
 */
function list(date) {
  return knex("reservations")
    .select()
    .where({ reservation_date: date.toString() })
    .whereNot({ "reservations.status": "finished" })
    .whereNot({ "reservations.status": "cancelled" })
    .orderBy("reservation_time");
}

/**
 * SQL query to find reservations by mobile number
 */
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

/**
 * SQL query to create new reservation
 */
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

/**
 * SQL query to find reservation matching a given ID
 */
function read(reservation_id) {
  return knex("reservations").select().where({ reservation_id }).first();
}

/**
 * SQL query to update a reservation with new data based on a given ID
 */
function update(reservation_id, data) {
  const { status } = data;
  return knex("reservations")
    .select()
    .where({ reservation_id })
    .update(data, "*")
    .returning("*")
    .then((reservationData) => reservationData[0]);
}

/**
 * SQL query to update a reservations status with new data based on a given ID
 */
function updateStatus(reservation_id, data) {
  const { status } = data;
  return knex("reservations")
    .select()
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((reservationData) => reservationData[0]);
}

module.exports = {
  list,
  search,
  create,
  read,
  update,
  updateStatus,
};