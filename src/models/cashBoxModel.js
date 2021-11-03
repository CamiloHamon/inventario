const db = require("../database/connection");

const cashBoxModel = {};

cashBoxModel.findByDate = async (date) => {
  return await db.query(`SELECT * FROM cashbox WHERE date = '${date}'`);
};

cashBoxModel.insert = async (date, idTurn, amount) => {
  return await db.query(
    `INSERT INTO cashbox (idTurn, date, amount) VALUES (${idTurn}, '${date}', '${amount}')`
  );
};

module.exports = cashBoxModel;
