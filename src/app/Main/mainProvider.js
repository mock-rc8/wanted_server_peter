const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mainDao = require("./mainDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMainList = async function (tag) {

  const connection = await pool.getConnection(async (conn) => conn);
  const mainListResult = await mainDao.selectMain(connection, tag);
  connection.release();

  return mainListResult;

};

exports.retrievemain = async function (mainId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mainResult = await mainDao.selectmainId(connection, mainId);

  connection.release();

  return mainResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await mainDao.selectmainEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectmainPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await mainDao.selectmainPassword(
      connection,
      selectmainPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mainAccountResult = await mainDao.selectmainAccount(connection, email);
  connection.release();

  return mainAccountResult;
};