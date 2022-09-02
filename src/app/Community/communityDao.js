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

module.exports = {
  selectCommunity,
  insertCommunityInfo,
  updateCommunityInfo,
  updateCommunityStatus,
  insertComment,
  updateComment,
  updateCommentStatus,
};
