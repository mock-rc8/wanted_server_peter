// 모든 유저 조회
async function selectrecruit(connection) {
  const selectrecruitListQuery = `
                SELECT email, name 
                FROM recruit;
                `;
  const [recruitRows] = await connection.query(selectrecruitListQuery);
  return recruitRows;
}

// 이메일로 회원 조회
async function selectrecruitEmail(connection, email) {
  const selectrecruitEmailQuery = `
                SELECT email, name 
                FROM recruit 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectrecruitEmailQuery, email);
  return emailRows;
}

// recruitId 회원 조회
async function selectrecruitId(connection, recruitId) {
  const selectrecruitIdQuery = `
                 SELECT id, email, nickname 
                 FROM recruitInfo 
                 WHERE id = ?;
                 `;
  const [recruitRow] = await connection.query(selectrecruitIdQuery, recruitId);
  return recruitRow;
}

// 유저 생성
async function insertrecruitInfo(connection, insertrecruitInfoParams) {
  const insertrecruitInfoQuery = `
        INSERT INTO recruit(name,
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
  const insertrecruitInfoRow = await connection.query(
    insertrecruitInfoQuery,
    insertrecruitInfoParams
  );

  return insertrecruitInfoRow;
}

// 패스워드 체크
async function selectrecruitPassword(connection, selectrecruitPasswordParams) {
  const selectrecruitPasswordQuery = `
        SELECT email, nickname, password
        FROM recruitInfo 
        WHERE email = ? AND password = ?;`;
  const selectrecruitPasswordRow = await connection.query(
      selectrecruitPasswordQuery,
      selectrecruitPasswordParams
  );

  return selectrecruitPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectrecruitAccount(connection, email) {
  const selectrecruitAccountQuery = `
        SELECT status, id
        FROM recruitInfo 
        WHERE email = ?;`;
  const selectrecruitAccountRow = await connection.query(
      selectrecruitAccountQuery,
      email
  );
  return selectrecruitAccountRow[0];
}

async function updaterecruitInfo(connection, id, nickname) {
  const updaterecruitQuery = `
  UPDATE recruitInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updaterecruitRow = await connection.query(updaterecruitQuery, [nickname, id]);
  return updaterecruitRow[0];
}

async function selectRecruit(connection, isLogged, tag1, tag2){
  let selectRecruitRows = [];

  const selectTagRecruitQuery = `
    SELECT * FROM
  ((SELECT recruitIdx, companyIdx, company, tag, thumbnailUrl, status
  FROM Recruit
  ORDER BY RAND())
  )R LEFT JOIN (
  SELECT companyIdx, industry, iconUrl
  FROM Company) C
  ON R.companyIdx = C.companyIdx
  WHERE R.tag = ?
  LIMIT 12;
  `

  const recruitTag1Row = await connection.query(selectTagRecruitQuery, tag1); // 태그1 기반 조회 채용 공고 ex: #급성장 중 회사들을 모아봤어요
  selectRecruitRows.push(recruitTag1Row);
  const recruitTag2Row = await connection.query(selectTagRecruitQuery, tag2); // 태그2 기반 조회 채용 공고 ex: #50인 이하 회사들을 모아봤어요
  selectRecruitRows.push(recruitTag2Row);

  const selectRecentRecruitQuery = ` 
  SELECT recruitIdx, companyIdx, company, title, thumbnailUrl, nation, location, responseRatio, status
  FROM Recruit
  ORDER BY RAND() LIMIT 4;
  `
  const recruitRecentRow = await connection.query(selectRecentRecruitQuery); // 요즘 뜨는 포지션 채용 공고
  selectRecruitRows.push(recruitRecentRow);


  if(isLogged == 1) { // 로그인한 상태일 경우
    let num = 0;
    const selectNumBookmarkRecruitQuery = `
      SELECT count(*) as num
      FROM (SELECT Recruit.recruitIdx, thumbnailUrl, title, company, location, nation
            FROM Recruit
                   JOIN RecruitBookmark RB on Recruit.recruitIdx = RB.recruitIdx) R;
    `
    num = await connection.query(selectNumBookmarkRecruitQuery); // 북마크한 채용공고 수

    const selectBookmarkRecruitQuery = `
      SELECT Recruit.recruitIdx, thumbnailUrl, title, company, location, nation
      FROM Recruit
             JOIN RecruitBookmark RB on Recruit.recruitIdx = RB.recruitIdx;
    `
    let recruitRows = await connection.query(selectBookmarkRecruitQuery); // 북마크한 채용공고

    if (num < 12) { // 북마크한 채용공고 수가 12개 미만일 때
      let otherNum = 12 - num
      const selectOtherRecruitQuery = `
        SELECT Recruit.recruitIdx, thumbnailUrl, title, company, location, nation
        FROM Recruit
        ORDER BY RAND() LIMIT ?;
      `
      recruitRows.push(await connection.query(selectOtherRecruitQuery, otherNum)); // 12 - 북마크한 채용공고 수 만큼 더해주기
    }
    selectRecruitRows.push(recruitRows);
  }

  return selectRecruitRows;

}

async function selectRecruitInfo(connection, recruitInfoPathVariable) {
  const selectRecruitInfoQuery = `
    SELECT recruitIdx, company, title, thumbnailUrl, location, nation, responseRatio, locationDetail, careerStart, careerEnd, jobGroupIdx, jobIdx, status
    FROM Recruit
    WHERE nation = ? AND
          location =? AND
          locationDetail = ? AND
          careerStart = ? AND
          careerEnd = ? AND
          jobGroupIdx = ? AND
          jobIdx = ? AND
          status = 'active';
  `;


  const selectRecruitInfoRows = await connection.query(selectRecruitInfoQuery, recruitInfoPathVariable);
  console.log('selectRecruitInfoRows: ', selectRecruitInfoRows);

  return selectRecruitInfoRows;
}

async function updateRecruitBookmark(connection, userIdx, recruitIdx) {
  // RecruitBookmark 테이블에 데이터 있는지 여부 확인
  const isFirstBookmarkQuery = `
  SELECT
      CASE
          WHEN userIdx IS NULL AND recruitIdx IS NULL THEN "Y"
          ELSE "N"
      END as isFirst
  FROM RecruitBookmark
  WHERE userIdx = ? AND recruitIdx = ?; 
  `;

  // RecruitBookmark 테이블에 처음 추가될 경우
  const insertRecruitBookmarkQuery = `
    INSERT INTO RecruitBookmark(userIdx, recruitIdx) VALUES (?, ?);
  `;

  // RecruitBookmark 테이블에 이미 추가되어 있는 경우
  const updateRecruitBookmarkQuery = `
    UPDATE RecruitBookmark SET status= if(status = 'active' , 'inactive', 'active')
    WHERE userIdx = ? AND recruitIdx = ?;
  `;
  const recruitBookmarkParams = [userIdx, recruitIdx];
  console.log('isFirstBookmarkResult 결과 얻기 전');
  console.log('userIdx: ', userIdx);
  console.log('recruitIdx: ', recruitIdx);
  const isFirstBookmarkResult = await connection.query(isFirstBookmarkQuery, recruitBookmarkParams); // 에러 구간
  console.log('isFirstBookmarkResult[0][0].isFirst: ', isFirstBookmarkResult[0][0].isFirst);
  if(isFirstBookmarkResult[0][0].isFirst == 'Y'){
    //const RecruitBookmarkResult =
        await connection.query(insertRecruitBookmarkQuery, recruitBookmarkParams);
  } else {
    //const RecruitBookmarkResult =
        await connection.query(updateRecruitBookmarkQuery, recruitBookmarkParams);
  }

}

module.exports = {
  selectRecruit,
  selectrecruitEmail,
  selectrecruitId,
  insertrecruitInfo,
  selectrecruitPassword,
  selectrecruitAccount,
  updaterecruitInfo,
  selectRecruitInfo,
  updateRecruitBookmark,
};
