module.exports = function(app){
    const community = require('./communityController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


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

    // 커뮤니티 댓글 수정 API
    app.patch('/app/communities/:commentidx', community.patchComment);

    // 커뮤니티 댓글 삭제 API
    app.patch('/app/communities/:commentidx/delete', community.patchCommentDelete);

    // 커뮤니티 좋아요 API
    app.patch('/app/communities/:communityidx/:useridx/likes', community.patchCommunityLike);

};