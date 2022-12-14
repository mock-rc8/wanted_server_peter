const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const recruitDao = require("./recruitDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRecruitList = async function (userIdx, tag1, tag2) {

    const connection = await pool.getConnection(async (conn) => conn);
    const recruitListResult = await recruitDao.selectRecruit(connection, userIdx, tag1, tag2);
    connection.release();

    return recruitListResult;
};

// 로그인 안했을 경우 채용페이지 조회
exports.retrieveRecruitNotLoggedList = async function(tag1, tag2){
  const connection = await pool.getConnection(async (conn) => conn);
  const recruitListResult = await recruitDao.selectRecruitNotLogged(connection, tag1, tag2);
  connection.release();

  return recruitListResult;
}

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