const jwtMiddleware = require("../../../config/jwtMiddleware");
const communityProvider = require("../../app/Community/communityProvider");
const communityService = require("../../app/Community/communityService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
/**
 *
 * 커뮤니티 조회
 */
exports.getCommunities = async function(req, res) {

    const communityListResult = await communityProvider.retrieveCommunityList();

    return res.send(response(baseResponse.SUCCESS, communityListResult));
}

/**
 *
 * 커뮤니티 글 작성
 */
exports.postCommunity = async function(req, res) {

    const {userIdx, empathy, interest, trend, nickname, title, content, imgUrl} = req.body;
    const postCommunityInfo = [userIdx, empathy, interest, trend, nickname, title, content, imgUrl];
    //console.log('postCommunityInfo: ', postCommunityInfo);
    const postCommunityResult = await communityService.postCommunity(postCommunityInfo);

    return res.send(postCommunityResult);
}


/**
 *
 * 커뮤니티 글 수정
 */
exports.patchCommunity = async function(req, res) {
    const communityIdx = req.params.communityidx;
    const {empathy, interest, trend, title, content, imgUrl} = req.body;
    const patchCommunityInfo = [empathy, interest, trend, title, content, imgUrl, communityIdx];
    const patchCommunityResult = await communityService.patchCommunity(patchCommunityInfo);

    return res.send(patchCommunityResult);

}

/**
 *
 * 커뮤니티 글 삭제 API
 */
exports.patchCommunityDelete = async function(req, res){
    const communityIdx = req.params.communityidx;
    const deleteCommunityResult = await communityService.patchCommunityDelete(communityIdx);
    return res.send(deleteCommunityResult);
}

/**
 *  커뮤니티 글에 댓글 추가 API
 */
exports.postComment = async function(req, res){
    const communityIdx = req.params.communityidx;
    const {userIdx, imgUrl, comment, nickname} = req.body;
    const postCommentInfo = [communityIdx, userIdx, imgUrl, comment, nickname];
    const postCommentResult = await communityService.postComment(postCommentInfo);
    return res.send(postCommentResult);
}

/**
 *  커뮤니티 글 댓글 수정 API
 */
exports.patchComment = async function(req, res){
    const commentIdx = req.params.commentidx;
    const comment = req.body;
    const patchCommentInfo = [comment, commentIdx];
    const patchCommentResult = await communityService.patchComment(patchCommentInfo);
    return res.send(patchCommentResult);
}

/**
 *  커뮤니티 글 댓글 삭제 API
 */
exports.patchCommentDelete = async function(req, res){
    const commentIdx = req.params.commentidx;
    const patchCommentDeleteResult = await communityService.patchCommentDelete(commentIdx);
    return res.send(patchCommentDeleteResult);
}

/**
 * 커뮤니티 글 좋아요 API
 */
exports.patchCommunityLike = async function(req, res){
    const communityIdx = req.params.communityidx;
    const userIdx = req.params.useridx;
    const patchCommunityLikeResult = await communityService.patchCommunityLike(communityIdx, userIdx);
    return res.send(patchCommunityLikeResult);
}