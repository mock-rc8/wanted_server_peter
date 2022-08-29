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

exports.createcommunity = async function (name,
                                     phone,
                                     email,
                                     password,
                                     jobGroupIdx,
                                     jobIdx,
                                     career,
                                     skill,
                                     university,
                                     company,
                                     empathy,
                                     interest,
                                     trend) {
    try {
    console.log('creatcommunity try 시작');
        // 이메일 중복 확인
        const emailRows = await communityProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        console.log('암호화 후');
        const insertcommunityInfoParams = [name,
            phone,
            email,
            hashedPassword,
            jobGroupIdx,
            jobIdx,
            career,
            skill,
            university,
            company,
            empathy,
            interest,
            trend];

        const connection = await pool.getConnection(async (conn) => conn);

        const communityIdResult = await communityDao.insertcommunityInfo(connection, insertcommunityInfoParams);
        console.log(`추가된 회원 : ${communityIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createcommunity Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await communityProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectcommunityPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await communityProvider.passwordCheck(selectcommunityPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const communityInfoRows = await communityProvider.accountCheck(email);

        if (communityInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (communityInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(communityInfoRows[0].id) // DB의 communityId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                communityId: communityInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "communityInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'communityId': communityInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editcommunity = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editcommunityResult = await communityDao.updatecommunityInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editcommunity Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}