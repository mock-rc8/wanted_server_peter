const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const eventDao = require("./eventDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveeventList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const eventListResult = await eventDao.selectevent(connection);
    connection.release();

    return eventListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const eventListResult = await eventDao.selecteventEmail(connection, email);
    connection.release();

    return eventListResult;
  }
};

exports.retrieveEvent = async function (tag1, tag2) {
  const connection = await pool.getConnection(async (conn) => conn);
  const eventResult = await eventDao.selectEvent(connection, tag1, tag2);

  connection.release();

  return eventResult[0];
};