const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const resumeDao = require("./resumeDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveResume = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeUserResult = await resumeDao.selectResume(connection, userIdx);
  connection.release();

  return resumeUserResult;
}

exports.retrieveresumeList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const resumeListResult = await resumeDao.selectresume(connection);
    connection.release();

    return resumeListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const resumeListResult = await resumeDao.selectresumeEmail(connection, email);
    connection.release();

    return resumeListResult;
  }
};

exports.retrieveresume = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await resumeDao.selectresumeId(connection, resumeId);

  connection.release();

  return resumeResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await resumeDao.selectresumeEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectresumePasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await resumeDao.selectresumePassword(
      connection,
      selectresumePasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeAccountResult = await resumeDao.selectresumeAccount(connection, email);
  connection.release();

  return resumeAccountResult;
};