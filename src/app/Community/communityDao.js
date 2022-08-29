// 커뮤니티 페이지 조회
async function selectCommunity(connection){
  const selectCommunityListQuery = `
  SELECT communityIdx, userIdx, empathy, interest, trend, profileUrl, nickname, jobGroupIdx, career, title, content, imgUrl, likeNum, commentNum, status
  FROM Community
  WHERE status = 'active'
  `;
  const [communityRows] = await connection.query(selectCommunityListQuery);
  return communityRows;
}

// 커뮤니티 글 작성
async function insertCommunityInfo(connection, postCommunityInfo){

  const postCommunityQuery = `
    INSERT INTO Community(userIdx, empathy, interest, trend, nickname, title, content, imgUrl) values
      (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const postCommunityResult = await connection.query(postCommunityQuery, postCommunityInfo);
  return postCommunityResult;
}

// 커뮤니티 글 수정
async function updateCommunityInfo(connection, patchCommunityInfo){
  const patchCommunityQuery = ` 
  UPDATE Community SET empathy = ?, interest = ?, trend = ?, title = ?, content = ?, imgUrl = ?
  WHERE communityIdx = ?; 
  `;
  const patchCommunityResult = await connection.query(patchCommunityQuery, patchCommunityInfo);
  return patchCommunityResult;
}

// 커뮤니티 글 삭제
async function updateCommunityStatus(connection, communityIdx){
  const updateCommunityStatusQuery = ` 
  UPDATE Community SET status = "inactive"
    WHERE communityIdx = ?;
  `;
  const updateCommunityStatusResult = await connection.query(updateCommunityStatusQuery, communityIdx);
  return updateCommunityStatusResult;
}

// 커뮤니티 글 댓글 추가
async function insertComment(connection, postCommentInfo){
  const insertCommunityQuery = ` 
  INSERT INTO CommunityComment(communityIdx, userIdx, imgUrl, comment, nickname) VALUES
    (?, ?, ?, ?, ?);
  `;
  const insertCommentResult = await connection.query(insertCommunityQuery, postCommentInfo);
  return insertCommentResult;
}

// 모든 유저 조회
async function selectcommunity(connection) {
  const selectcommunityListQuery = `
                SELECT email, name 
                FROM community;
                `;
  const [communityRows] = await connection.query(selectcommunityListQuery);
  return communityRows;
}

// 이메일로 회원 조회
async function selectcommunityEmail(connection, email) {
  const selectcommunityEmailQuery = `
                SELECT email, name 
                FROM community 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectcommunityEmailQuery, email);
  return emailRows;
}

// communityId 회원 조회
async function selectcommunityId(connection, communityId) {
  const selectcommunityIdQuery = `
                 SELECT id, email, nickname 
                 FROM communityInfo 
                 WHERE id = ?;
                 `;
  const [communityRow] = await connection.query(selectcommunityIdQuery, communityId);
  return communityRow;
}

// 유저 생성
async function insertcommunityInfo(connection, insertcommunityInfoParams) {
  const insertcommunityInfoQuery = `
        INSERT INTO community(name,
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
  const insertcommunityInfoRow = await connection.query(
    insertcommunityInfoQuery,
    insertcommunityInfoParams
  );

  return insertcommunityInfoRow;
}

// 패스워드 체크
async function selectcommunityPassword(connection, selectcommunityPasswordParams) {
  const selectcommunityPasswordQuery = `
        SELECT email, nickname, password
        FROM communityInfo 
        WHERE email = ? AND password = ?;`;
  const selectcommunityPasswordRow = await connection.query(
      selectcommunityPasswordQuery,
      selectcommunityPasswordParams
  );

  return selectcommunityPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectcommunityAccount(connection, email) {
  const selectcommunityAccountQuery = `
        SELECT status, id
        FROM communityInfo 
        WHERE email = ?;`;
  const selectcommunityAccountRow = await connection.query(
      selectcommunityAccountQuery,
      email
  );
  return selectcommunityAccountRow[0];
}

async function updatecommunityInfo(connection, id, nickname) {
  const updatecommunityQuery = `
  UPDATE communityInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updatecommunityRow = await connection.query(updatecommunityQuery, [nickname, id]);
  return updatecommunityRow[0];
}


module.exports = {
  selectcommunity,
  selectcommunityEmail,
  selectcommunityId,
  insertcommunityInfo,
  selectcommunityPassword,
  selectcommunityAccount,
  updatecommunityInfo,
  selectCommunity,
  insertCommunityInfo,
  updateCommunityInfo,
  updateCommunityStatus,
  insertComment,

};
