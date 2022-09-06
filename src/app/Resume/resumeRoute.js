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

    // 회원 이력서 경력 - 성과 추가 API
    app.post('/app/resumes/performance/:resumecareeridx', resume.postCareerPerformance);

    // 회원 이력서 학력 추가 API
    app.post('/app/resumes/education/:resumeidx', resume.postResumeEducation);

    // 회원 이력서 스킬 추가 API
    app.post('/app/resumes/skills/:resumeidx', resume.postResumeSkill);

    // 회원 이력서 수상 추가 API
    app.post('/app/resumes/prizes/:resumeidx', resume.postResumePrize);

    // 회원 이력서 외국어 추가 API
    app.post('/app/resumes/langs/:resumeidx', resume.postResumeLang);

    // 회원 이력서 외국어 - 어학시험  추가 API
    app.post('/app/resumes/langtests/:resumelangidx', resume.postResumeLangtest);

    
};
