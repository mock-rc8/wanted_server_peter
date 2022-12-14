const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const resumeProvider = require("./resumeProvider");
const resumeDao = require("./resumeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 이력서 생성
exports.postResume = async function(postResumeParams){
    const connection = await pool.getConnection(async (conn) => conn);
    const postResumeResult = await resumeDao.postResumeInfo(connection, postResumeParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.createresume = async function (name,
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
    console.log('creatresume try 시작');
        // 이메일 중복 확인
        const emailRows = await resumeProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        console.log('암호화 후');
        const insertresumeInfoParams = [name,
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

        const resumeIdResult = await resumeDao.insertresumeInfo(connection, insertresumeInfoParams);
        console.log(`추가된 회원 : ${resumeIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createresume Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postResumeCareer = async function(postResumeCareerParams){
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeCareer(connection, postResumeCareerParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeCareerPerformance = async function(careerPerformanceParams){
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeCareerPerformance(connection, careerPerformanceParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeEducation = async function(resumeEducationParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeEducation(connection, resumeEducationParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeSkill = async function(resumeSkillParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeSkill(connection, resumeSkillParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumePrize = async function(resumePrizeParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumePrize(connection, resumePrizeParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeLang = async function(resumeLangParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeLang(connection, resumeLangParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeLangTest = async function(resumeLangTestParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeLangTest(connection, resumeLangTestParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.postResumeLink = async function(resumeLinkParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    await resumeDao.insertResumeLink(connection, resumeLinkParams);
    connection.release();
    return response(baseResponse.SUCCESS);
}