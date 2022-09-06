const resume = require("./resumeController");
module.exports = function(app){
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 이력서 페이지 조회 API
    app.get('/app/resumes/:useridx', resume.getResumeByUser);

    // 새 이력서 생성 API
    app.post('/app/resumes/:useridx', resume.postResumeByUser);

    // 회원 이력서 경력 추가 API
    app.post('/app/resumes/career/:resumeidx', resume.postResumeCareer);

};
