const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const communityDao = require("./communityDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveCommunityList = async function(){
  const connection = await pool.getConnection(async (conn) => conn);
  const communityListResult = await communityDao.selectCommunity(connection);
  connection.release();

  return communityListResult;
}

exports.retrievecommunityList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const communityListResult = await communityDao.selectcommunity(connection);
    connection.release();

    return communityListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const communityListResult = await communityDao.selectcommunityEmail(connection, email);
    connection.release();

    return communityListResult;
  }
};

exports.retrievecommunity = async function (communityId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const communityResult = await communityDao.selectcommunityId(connection, communityId);

  connection.release();

  return communityResult[0];
};