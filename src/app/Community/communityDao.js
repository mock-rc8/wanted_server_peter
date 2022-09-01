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
  // Community 테이블에 데이터 삽입해 글 작성 쿼리
  const postCommunityQuery = `
    INSERT INTO Community(userIdx, empathy, interest, trend, nickname, title, content, imgUrl) values
      (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  // 글 작성한 유저의 프로필 이미지 url 조회 쿼리
  const selectUserImgQuery = ` 
    SELECT imgUrl FROM User WHERE userIdx = ?;
  `;
  // 글 작성한 회원 프사를 Community테이블 프로필url에 삽입
  const updateUserImgQuery = `
    UPDATE Community SET profileUrl = ? WHERE communityIdx = ?;
  `;
  // 마지막행 커뮤니티 인덱스(가장 최근 추가된 커뮤니티 글의 인덱스) 조회
  const selectCommunityIdxQuery = `
    SELECT communityIdx FROM Community ORDER BY communityIdx DESC LIMIT 1;
  `;

  try { // 트랜잭션 처리
    const postCommunityResult = await connection.query(postCommunityQuery, postCommunityInfo); // 글 작성
    const [communityIdx] = await connection.query(selectCommunityIdxQuery); // 커뮤니티 인덱스 조회
    console.log("communityIdx: ", communityIdx);
    console.log("communityIdx[0].communityIdx: ", Number(communityIdx[0].communityIdx));

    const [userImgUrl] = await connection.query(selectUserImgQuery, postCommunityInfo[0]); // 회원 프사 조회
    console.log("userImgUrl[0].imgUrl: ", userImgUrl[0].imgUrl);
    const selectUserImgParams = [userImgUrl[0].imgUrl , Number(communityIdx[0].communityIdx)]; // 회원 프사 삽입할때 필요한 매개변수
    console.log("selectUserImgParams: ", selectUserImgParams);
    await connection.query(updateUserImgQuery, selectUserImgParams); // 회원 프사 Community테이블 profileUrl 갱신

    await connection.commit() // 커밋
    return postCommunityResult;
  } catch(err) {
    console.log(err);
    await connection.rollback() // 롤백
    return;
  }
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

// 커뮤니티 글 댓글 수정
async function updateComment(connection, patchCommentInfo){
  const updateCommentQuery = `
  UPDATE CommunityComment SET comment = ?
    WHERE commentIdx = ?;
  `;
  const updateCommentResult = await connection.query(updateCommentQuery, patchCommentInfo);
  return updateCommentResult;
}

// 커뮤니티 글 댓글 삭제
async function updateCommentStatus(connection, commentIdx){
  const updateCommentStatusQuery = ` 
  UPDATE CommunityComment SET status = 'inactive'
WHERE commentIdx = ?;
  `;
  const updateCommentStatusResult = await connection.query(updateCommentStatusQuery, commentIdx);
  return updateCommentStatusResult;
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
  updateComment,
  updateCommentStatus,

};
