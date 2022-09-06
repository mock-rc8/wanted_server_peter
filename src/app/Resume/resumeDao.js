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
  const insertResumeInfoQuery = `
    INSERT INTO Resume(userIdx, title, name, email, phone, aboutMe, skill) 
    VALUES(?, ?, ?, ?, ?, ?, ?);
    `;
  await connection.query(
    insertResumeInfoQuery,
    postResumeParams
  );

  return;
}

// 이력서 경력 생성
async function insertResumeCareer(connection, postResumeCareerParams) {
  const insertResumeCareerQuery = `
    INSERT INTO ResumeCareer(resumeIdx, careerStart, careerEnd, company, workType, department, duty, isCurrent) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  await connection.query(insertResumeCareerQuery, postResumeCareerParams);
  return;
}

// 이력서 경력 - 주요성과 생성
async function insertResumeCareerPerformance(connection, careerPerformanceParams) {
  const insertCareerPerformaQuery = ` 
    INSERT INTO ResumePerformance(resumeCareerIdx, performance, performanceStart, performanceEnd, content) VALUES
    (?, ?, ?, ?, ?);
  `;
  await connection.query(insertCareerPerformaQuery, careerPerformanceParams);
  return;
}

// 이력서 학력 생성
async function insertResumeEducation(connection, careerPerformanceParams) {
  const insertResumeEducationQuery = `
    INSERT INTO ResumeEducation(resumeIdx, educationStart, educationEnd, school, major, finishClass, isCurrent) VALUES
      (?, ?, ?, ?, ?, ?, ?);
  `;
  await connection.query(insertResumeEducationQuery, careerPerformanceParams);
  return;
}

async function insertResumeSkill(connection, resumeSkillParams) {
  const insertResumeSkillQuery = `
    INSERT INTO ResumeSkill(resumeIdx, skill) VALUES
    (?, ?);
  `;
  await connection.query(insertResumeSkillQuery, resumeSkillParams);
  return;
}

async function insertResumePrize(connection, resumePrizeParams) {
  const insertResumePrizeQuery = `
    INSERT INTO ResumePrize(resumeIdx, prizeDate, activityName, activityDetail) VALUES
    (?, ?, ?, ?);
  `;
  await connection.query(insertResumePrizeQuery, resumePrizeParams);
  return;
}

async function insertResumeLang(connection, resumeLangParams) {
  const insertResumeLangQuery = `
    INSERT INTO ResumeLanguage(resumeIdx, language, class) VALUES
    (?, ?, ?);
  `;
  await connection.query(insertResumeLangQuery, resumeLangParams);
  return;
}

async function insertResumeLangTest(connection, resumeLangTestParams) {
  const insertResumeLangQuery = `
    INSERT INTO ResumeLangTest(resumeLangIdx, testName, score, testDate) VALUES
      (?, ?, ?, ?);
  `;
  await connection.query(insertResumeLangQuery, resumeLangTestParams);
  return;
}

async function insertResumeLink(connection, resumeLinkParams){
  const insertResumeLinkQuery = `
    INSERT INTO ResumeLink(resumeIdx, link) VALUES
      (?, ?);
  `;
  await connection.query(insertResumeLinkQuery, resumeLinkParams);
  return;
}

module.exports = {
  selectResume,
  postResumeInfo,
  insertResumeCareer,
  insertResumeCareerPerformance,
  insertResumeEducation,
  insertResumeSkill,
  insertResumePrize,
  insertResumeLang,
  insertResumeLangTest,
  insertResumeLink,
};