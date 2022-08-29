module.exports = function(app){
    const community = require('./communityController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');



    // 0. 테스트 API
    //app.get('/app/test', community.getTest)

    // 1. 유저 생성 (회원가입) API
    //app.post('/app/communitys', community.postcommunitys);


    // 2. 유저 조회 API (+ 검색)
    //app.get('/app/communitys',community.getcommunitys);

    // 3. 특정 유저 조회 API
    // app.get('/app/communitys/:communityId', community.getcommunityById);

    // 커뮤니티 페이지 조회 API
    app.get('/app/communities', community.getCommunities);

    // 커뮤니티 글 작성 API
    app.post('/app/communities', community.postCommunity);

    // 커뮤니티 글 수정 API
    app.patch('/app/communities/:communityidx', community.patchCommunity);

    // 커뮤니티 글 삭제 API
    app.patch('/app/communities/:communityidx/delete', community.patchCommunityDelete);

    // 커뮤니티 댓글 추가 API
    app.post('/app/communities/:communityidx/comment', community.postComment);


};