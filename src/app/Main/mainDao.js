// 모든 유저 조회
async function selectMain(connection, tag) {

  let mainResultArray = [];
  //console.log('mainDao에서 tag: ', tag);
  if(!tag){
    const selectContentsQuery = `
    SELECT *
    FROM (SELECT contentsIdx, title, introduction, thumbnailUrl, type, link, tag, creator, status
    FROM Contents
    ORDER BY RAND()) contents
    WHERE contents.status = 'active'
    LIMIT 8;
  `;
    const [contentsRows] = await connection.query(selectContentsQuery);
    mainResultArray.push(contentsRows);
  }
  else{
    const selectContentsQuery = `
    SELECT *
    FROM (SELECT contentsIdx, title, introduction, thumbnailUrl, type, link, tag, creator, status
    FROM Contents
    ORDER BY RAND()) contents
    WHERE contents.status = 'active' AND contents.tag =?
    LIMIT 8;
  `;
    const [contentsRows] = await connection.query(selectContentsQuery, tag);
    mainResultArray.push(contentsRows);
  }
  //console.log('contentsRows 타입: ', typeof mainResultArray[0]);

  const selectWantedContentsQuery = `
    SELECT *
FROM
  (SELECT wantedContentsIdx, title, thumbnailUrl, type, tag1, link, status
  FROM wantedContents
  ORDER BY RAND())WC
  WHERE WC.status = 'active'
  LIMIT 4;
  `;
  const selectWantedPlusQuery = `
      SELECT *
  FROM (SELECT wantedPlusIdx, name, title, introduction, thumbnailUrl, tag, status
  FROM wantedPlus
  ORDER BY RAND()) WP
  WHERE WP.status = 'active'
  LIMIT 4;
  `;
  const selectContentsTwoQuery = `
  SELECT * FROM
  (SELECT wantedContentsIdx, title, thumbnailUrl, type, isOnline, endDate, link, status
  FROM wantedContents
  ORDER BY RAND())WC
  WHERE WC.status = 'active'
  LIMIT 2;
  `;

  const [wantedContentsRows] = await connection.query(selectWantedContentsQuery);
  mainResultArray.push(wantedContentsRows);
  const [wantedPlusRows] = await connection.query(selectWantedPlusQuery);
  mainResultArray.push(wantedPlusRows);
  const [contentsTwoRows] = await connection.query(selectContentsTwoQuery);
  mainResultArray.push(contentsTwoRows);
  //console.log('mainResultArray 타입: ', typeof mainResultArray);
  return mainResultArray;

}

// 이메일로 회원 조회
async function selectmainEmail(connection, email) {
  const selectmainEmailQuery = `
                SELECT email, name 
                FROM main 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectmainEmailQuery, email);
  return emailRows;
}

// mainId 회원 조회
async function selectmainId(connection, mainId) {
  const selectmainIdQuery = `
                 SELECT id, email, nickname 
                 FROM mainInfo 
                 WHERE id = ?;
                 `;
  const [mainRow] = await connection.query(selectmainIdQuery, mainId);
  return mainRow;
}

// 유저 생성
async function insertmainInfo(connection, insertmainInfoParams) {
  const insertmainInfoQuery = `
        INSERT INTO main(name,
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
  const insertmainInfoRow = await connection.query(
    insertmainInfoQuery,
    insertmainInfoParams
  );

  return insertmainInfoRow;
}

// 패스워드 체크
async function selectmainPassword(connection, selectmainPasswordParams) {
  const selectmainPasswordQuery = `
        SELECT email, nickname, password
        FROM mainInfo 
        WHERE email = ? AND password = ?;`;
  const selectmainPasswordRow = await connection.query(
      selectmainPasswordQuery,
      selectmainPasswordParams
  );

  return selectmainPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectmainAccount(connection, email) {
  const selectmainAccountQuery = `
        SELECT status, id
        FROM mainInfo 
        WHERE email = ?;`;
  const selectmainAccountRow = await connection.query(
      selectmainAccountQuery,
      email
  );
  return selectmainAccountRow[0];
}

async function updatemainInfo(connection, id, nickname) {
  const updatemainQuery = `
  UPDATE mainInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updatemainRow = await connection.query(updatemainQuery, [nickname, id]);
  return updatemainRow[0];
}


module.exports = {
  selectMain,
  selectmainEmail,
  selectmainId,
  insertmainInfo,
  selectmainPassword,
  selectmainAccount,
  updatemainInfo,
};
