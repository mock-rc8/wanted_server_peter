const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const recruitDao = require("./recruitDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRecruitList = async function (isLogged, tag1, tag2) {
  /*if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const recruitListResult = await recruitDao.selectrecruit(connection);
    connection.release();

    return recruitListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const recruitListResult = await recruitDao.selectrecruitEmail(connection, email);
    connection.release();

    return recruitListResult;
  }*/


    const connection = await pool.getConnection(async (conn) => conn);
    const recruitListResult = await recruitDao.selectRecruit(connection, isLogged, tag1, tag2);
    connection.release();

    return recruitListResult;

};

exports.retrieveRecruitInfoList = async function(recruitInfoPathVariable) {
  const connection = await pool.getConnection(async (conn) => conn);
  const recruitInfoResult = await recruitDao.selectRecruitInfo(connection, recruitInfoPathVariable);

  connection.release();
  return recruitInfoResult[0];
}

exports.retrieverecruit = async function (recruitId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const recruitResult = await recruitDao.selectrecruitId(connection, recruitId);

  connection.release();

  return recruitResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await recruitDao.selectrecruitEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectrecruitPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await recruitDao.selectrecruitPassword(
      connection,
      selectrecruitPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const recruitAccountResult = await recruitDao.selectrecruitAccount(connection, email);
  connection.release();

  return recruitAccountResult;
};