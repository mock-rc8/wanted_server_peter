const recruit = require("./recruitController");
module.exports = function(app){
    const recruit = require('./recruitController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', recruit.getTest)

    // 1. 유저 생성 (회원가입) API
    //app.post('/app/recruits', recruit.postrecruits);


    // 2. 유저 조회 API (+ 검색)
    //app.get('/app/recruits',recruit.getrecruits);

    // 3. 특정 유저 조회 API
    // app.get('/app/recruits/:recruitId', recruit.getrecruitById);

    // 채용 페이지 조회(로그인했을 경우) API
    app.get('/app/recruits/:useridx', recruit.getRecruits);

    // 채용 페이지 조회 API
    app.get('/app/recruits', recruit.getRecruitsNogLogged);

    // 채용 정보 페이지 조회 API
    app.get('/app/recruitings/:nation/:location/:locationdetail/:careerstart/:careerend/:jobgroupidx/:jobidx', recruit.getRecruitInfo);

    // 채용공고 북마크 API
    // userIdx 또는 recruitIdx가 존재하지 않는 경우 validation 처리 해줘야 함.
    //app.patch('/app/recruits/:useridx/bookmarks/:recruitidx', recruit.patchBookmark);

};