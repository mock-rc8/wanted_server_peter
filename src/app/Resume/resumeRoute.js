const resume = require("./resumeController");
module.exports = function(app){
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    //app.get('/app/test', resume.getTest)

    // 1. 유저 생성 (회원가입) API
    //app.post('/app/resumes', resume.postresumes);


    // 2. 유저 조회 API (+ 검색)
    //app.get('/app/resumes',resume.getresumes);

    // 3. 특정 유저 조회 API
    // app.get('/app/resumes/:resumeId', resume.getresumeById);


    // 이력서 페이지 조회 API
    app.get('/app/resumes/:useridx', resume.getResumeByUser);

    // 새 이력서 작성 API
    app.post('/app/resumes/:useridx/:resumeidx', resume.postResumeByUser);
};
