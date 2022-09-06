// 이력서 조회
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


// 이력서 생성
async function postResumeInfo(connection, postResumeParams) {
  const insertresumeInfoQuery = `
    INSERT INTO Resume(userIdx, title, name, email, phone, aboutMe, skill) 
    VALUES(?, ?, ?, ?, ?, ?, ?);
    `;
  await connection.query(
    insertresumeInfoQuery,
    postResumeParams
  );

  return;
}


module.exports = {
  selectResume,
  postResumeInfo,
};