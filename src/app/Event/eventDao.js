
// 이벤트 페이지 조회
async function selectEvent(connection, tag1, tag2) {
  let eventRow = [];

  // 1. tag1, tag2 둘 다 없을 경우
  let selectEventQuery1 = `
    SELECT wantedContentsIdx, title, thumbnailUrl, type, isFree, tag1, tag2, isOnline, startDate, endDate, isFull, link, status
    FROM wantedContents
    WHERE status = 'active';
  `;
  // 2. tag1만 있을 경우
  let selectEventQuery2 = `
    SELECT wantedContentsIdx, title, thumbnailUrl, type, isFree, tag1, tag2, isOnline, startDate, endDate, isFull, link, status
    FROM wantedContents
    WHERE status = 'active' AND tag1 = ?;
  `;
  // 3. tag2만 있을 경우
  let selectEventQuery3 = `
    SELECT wantedContentsIdx, title, thumbnailUrl, type, isFree, tag1, tag2, isOnline, startDate, endDate, isFull, link, status
    FROM wantedContents
    WHERE status = 'active' AND tag2 = ?;
  `;
  // 4. tag1, tag2 둘 다 있을 경우
  let selectEventQuery4 = `
    SELECT wantedContentsIdx, title, thumbnailUrl, type, isFree, tag1, tag2, isOnline, startDate, endDate, isFull, link, status
    FROM wantedContents
    WHERE status = 'active' AND tag1 = ? AND tag2 = ?;
  `;

  if(!tag1 && !tag2){
    eventRow = await connection.query(selectEventQuery1);
  }
  else if(tag1 && !tag2){
    eventRow = await connection.query(selectEventQuery2, tag1);
  }
  else if(!tag1 && tag2){
    eventRow = await connection.query(selectEventQuery3, tag2);
  }
  else{
    const selectEventParams = [tag1, tag2];
    eventRow = await connection.query(selectEventQuery4, selectEventParams);
  }

  //const [eventRow] = await connection.query(selectEventQuery, eventId);
  return eventRow;
}

module.exports = {
  selectEvent,
};
