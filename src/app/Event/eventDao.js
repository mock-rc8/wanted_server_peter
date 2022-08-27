// 모든 유저 조회
async function selectevent(connection) {
  const selecteventListQuery = `
                SELECT email, name 
                FROM event;
                `;
  const [eventRows] = await connection.query(selecteventListQuery);
  return eventRows;
}

// 이메일로 회원 조회
async function selecteventEmail(connection, email) {
  const selecteventEmailQuery = `
                SELECT email, name 
                FROM event 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selecteventEmailQuery, email);
  return emailRows;
}

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

// 유저 생성
async function inserteventInfo(connection, inserteventInfoParams) {
  const inserteventInfoQuery = `
        INSERT INTO event(name,
                         phone,
                         email,
                         password,
                         jobGroupIdx,
                         jobIdx,
                         career,
                         skill,
                         university,
                         company,
                         empathy,
                         interest,
                         trend)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const inserteventInfoRow = await connection.query(
    inserteventInfoQuery,
    inserteventInfoParams
  );

  return inserteventInfoRow;
}

// 패스워드 체크
async function selecteventPassword(connection, selecteventPasswordParams) {
  const selecteventPasswordQuery = `
        SELECT email, nickname, password
        FROM eventInfo 
        WHERE email = ? AND password = ?;`;
  const selecteventPasswordRow = await connection.query(
      selecteventPasswordQuery,
      selecteventPasswordParams
  );

  return selecteventPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selecteventAccount(connection, email) {
  const selecteventAccountQuery = `
        SELECT status, id
        FROM eventInfo 
        WHERE email = ?;`;
  const selecteventAccountRow = await connection.query(
      selecteventAccountQuery,
      email
  );
  return selecteventAccountRow[0];
}

async function updateeventInfo(connection, id, nickname) {
  const updateeventQuery = `
  UPDATE eventInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateeventRow = await connection.query(updateeventQuery, [nickname, id]);
  return updateeventRow[0];
}


module.exports = {
  selectevent,
  selecteventEmail,
  selectEvent,
  inserteventInfo,
  selecteventPassword,
  selecteventAccount,
  updateeventInfo,
};
