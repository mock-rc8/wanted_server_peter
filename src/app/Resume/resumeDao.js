async function selectResume(connection, userIdx) {
  // 회원 이력서인덱스 추출
  const selectResumeIdxQuery = `
    SELECT resumeIdx FROM Resume WHERE userIdx = ?;
  `;
  let [resumeIdx] = await connection.query(selectResumeIdxQuery, userIdx);

  for(var i=0; i< resumeIdx.length; i++){ // resumeIdx 인덱스번호만 추출
    resumeIdx[i] = resumeIdx[i].resumeIdx;
  }

  // 수정날짜 조회 쿼리문
  const selectDateQuery = `
  SELECT DATE_FORMAT((SELECT updatedAt FROM Resume WHERE userIdx = ? AND resumeIdx = ?), '%Y/%m/%d') as date;
  `;
  let date = []; // 이력서별 수정날짜를 담을 배열
  for(var i=0; i<resumeIdx.length; i++){
    let dateParams = [Number(userIdx)]; // userIdx, resumeIdx 담을 배열
    dateParams.push(resumeIdx[i]);

    let resumeDate = await connection.query(selectDateQuery, dateParams);
    date.push(resumeDate[0][0].date);
  }

  // 이력서인덱스, 제목, 작성 중 여부 추출 쿼리문
  const selectResumeQuery = `
  SELECT resumeIdx, title, isFinish FROM Resume WHERE userIdx = ?;
`;
  let selectResumeList = await connection.query(selectResumeQuery, userIdx);
  //console.log(selectResumeList[0]);

  for(var i=0; i<resumeIdx.length; i++){
    selectResumeList[0][i].date = date[i]; // 객체에 속성 추가
  }

  // 회원 프로필 이미지 url 추출 쿼리문
  const selectUserProfileQuery = `
  SELECT imgUrl FROM User WHERE userIdx = ?;
  `;

  const userProfileImg = await connection.query(selectUserProfileQuery, userIdx);

  selectResumeList[0].push(userProfileImg[0][0]); // 회원 프로필 사진 url 삽입

  //console.log(selectResumeList[0]);
  return selectResumeList[0];
}

// 모든 유저 조회
async function selectresume(connection) {
  const selectresumeListQuery = `
                SELECT email, name 
                FROM resume;
                `;
  const [resumeRows] = await connection.query(selectresumeListQuery);
  return resumeRows;
}

// 이메일로 회원 조회
async function selectresumeEmail(connection, email) {
  const selectresumeEmailQuery = `
                SELECT email, name 
                FROM resume 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectresumeEmailQuery, email);
  return emailRows;
}

// resumeId 회원 조회
async function selectresumeId(connection, resumeId) {
  const selectresumeIdQuery = `
                 SELECT id, email, nickname 
                 FROM resumeInfo 
                 WHERE id = ?;
                 `;
  const [resumeRow] = await connection.query(selectresumeIdQuery, resumeId);
  return resumeRow;
}

// 유저 생성
async function insertresumeInfo(connection, insertresumeInfoParams) {
  const insertresumeInfoQuery = `
        INSERT INTO resume(name,
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
  const insertresumeInfoRow = await connection.query(
    insertresumeInfoQuery,
    insertresumeInfoParams
  );

  return insertresumeInfoRow;
}

// 패스워드 체크
async function selectresumePassword(connection, selectresumePasswordParams) {
  const selectresumePasswordQuery = `
        SELECT email, nickname, password
        FROM resumeInfo 
        WHERE email = ? AND password = ?;`;
  const selectresumePasswordRow = await connection.query(
      selectresumePasswordQuery,
      selectresumePasswordParams
  );

  return selectresumePasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectresumeAccount(connection, email) {
  const selectresumeAccountQuery = `
        SELECT status, id
        FROM resumeInfo 
        WHERE email = ?;`;
  const selectresumeAccountRow = await connection.query(
      selectresumeAccountQuery,
      email
  );
  return selectresumeAccountRow[0];
}

async function updateresumeInfo(connection, id, nickname) {
  const updateresumeQuery = `
  UPDATE resumeInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateresumeRow = await connection.query(updateresumeQuery, [nickname, id]);
  return updateresumeRow[0];
}


module.exports = {
  selectresume,
  selectresumeEmail,
  selectresumeId,
  insertresumeInfo,
  selectresumePassword,
  selectresumeAccount,
  updateresumeInfo,
  selectResume,
};
