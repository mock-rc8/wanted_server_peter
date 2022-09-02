const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const communityProvider = require("./communityProvider");
const communityDao = require("./communityDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 커뮤니티 글 작성
exports.postCommunity = async function(postCommunityInfo){

    const connection = await pool.getConnection(async (conn) => conn);
    const postCommunityResult = await communityDao.insertCommunityInfo(connection, postCommunityInfo);
    connection.release();
    return response(baseResponse.SUCCESS, postCommunityResult);
}

// 커뮤니티 글 수정
exports.patchCommunity = async function(patchCommunityInfo){
    const connection = await pool.getConnection(async (conn) => conn);
    const patchCommunityResult = await communityDao.updateCommunityInfo(connection, patchCommunityInfo);
    connection.release();
    return response(baseResponse.SUCCESS, patchCommunityResult);
}

// 커뮤니티 글 삭제
exports.patchCommunityDelete = async function(communityIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const patchCommunityDeleteResult = await communityDao.updateCommunityStatus(connection, communityIdx);
    connection.release();
    return response(baseResponse.SUCCESS, patchCommunityDeleteResult);
}

// 커뮤니티 글 댓글 추가
exports.postComment = async function(postCommentInfo){
    const connection = await pool.getConnection(async (conn) => conn);
    const postCommentResult = await communityDao.insertComment(connection, postCommentInfo);
    connection.release();
    return response(baseResponse.SUCCESS, postCommentResult);
}

// 커뮤니티 글 댓글 수정 API
exports.patchComment = async function(patchCommentInfo){
    const connection = await pool.getConnection(async (conn) => conn);
    const patchCommentResult = await communityDao.updateComment(connection, patchCommentInfo);
    connection.release();
    return response(baseResponse.SUCCESS, patchCommentResult);
}

// 커뮤니티 글 댓글 삭제 API
exports.patchCommentDelete = async function(commentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const patchCommentDeleteResult = await communityDao.updateCommentStatus(connection, commentIdx);
    connection.release();
    return response(baseResponse.SUCCESS, patchCommentDeleteResult);
}