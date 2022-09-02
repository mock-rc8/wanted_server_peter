const resume = require("./resumeController");
module.exports = function(app){
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 이력서 페이지 조회 API
    app.get('/app/resumes/:useridx', resume.getResumeByUser);

    // 새 이력서 작성 API
    app.post('/app/resumes/:useridx/:resumeidx', resume.postResumeByUser);
};
