const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const recruitProvider = require("./recruitProvider");
const recruitDao = require("./recruitDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createrecruit = async function (name,
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
    console.log('creatrecruit try 시작');
        // 이메일 중복 확인
        const emailRows = await recruitProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        console.log('암호화 후');
        const insertrecruitInfoParams = [name,
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

        const recruitIdResult = await recruitDao.insertrecruitInfo(connection, insertrecruitInfoParams);
        console.log(`추가된 회원 : ${recruitIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createrecruit Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 채용공고 북마크 API
exports.patchRecruitBookmark = async function(userIdx, recruitIdx) {

    const connection = await pool.getConnection(async (conn) => conn);

    //const recruitBookmarkResult =
    await recruitDao.updateRecruitBookmark(connection, userIdx, recruitIdx);
    connection.release();
    return response(baseResponse.SUCCESS);

}


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await recruitProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectrecruitPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await recruitProvider.passwordCheck(selectrecruitPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const recruitInfoRows = await recruitProvider.accountCheck(email);

        if (recruitInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (recruitInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(recruitInfoRows[0].id) // DB의 recruitId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                recruitId: recruitInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "recruitInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'recruitId': recruitInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editrecruit = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editrecruitResult = await recruitDao.updaterecruitInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editrecruit Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}