const jwtMiddleware = require("../../../config/jwtMiddleware");
const resumeProvider = require("../../app/resume/resumeProvider");
const resumeService = require("../../app/resume/resumeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getResumeByUser = async function (req, res) {
    const userIdx = req.params.useridx;
    const resumeUserResult = await resumeProvider.retrieveResume(userIdx);

    return res.send(response(baseResponse.SUCCESS, resumeUserResult));
}

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/resumes
 */
exports.postresumes = async function (req, res) {

    /**
     * Body: name, phone, email, jobGroupIdx, jobIdx, career, skill, university, company empathy, interest, trend
     */
    const {name, phone, email, password, jobGroupIdx, jobIdx, career, skill, university, company, empathy, interest, trend} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await resumeService.createresume(
        name,
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
        trend
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/resumes
 */
exports.getresumes = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const resumeListResult = await resumeProvider.retrieveresumeList();
        return res.send(response(baseResponse.SUCCESS, resumeListResult));
    } else {
        // 유저 검색 조회
        const resumeListByEmail = await resumeProvider.retrieveresumeList(email);
        return res.send(response(baseResponse.SUCCESS, resumeListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/resumes/{resumeId}
 */
exports.getresumeById = async function (req, res) {

    /**
     * Path Variable: resumeId
     */
    const resumeId = req.params.resumeId;

    if (!resumeId) return res.send(errResponse(baseResponse.resume_resumeID_EMPTY));

    const resumeByresumeId = await resumeProvider.retrieveresume(resumeId);
    return res.send(response(baseResponse.SUCCESS, resumeByresumeId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await resumeService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/resumes/:resumeId
 * path variable : resumeId
 * body : nickname
 */
exports.patchresumes = async function (req, res) {

    // jwt - resumeId, path variable :resumeId

    const resumeIdFromJWT = req.verifiedToken.resumeId

    const resumeId = req.params.resumeId;
    const nickname = req.body.nickname;

    if (resumeIdFromJWT != resumeId) {
        res.send(errResponse(baseResponse.resume_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.resume_NICKNAME_EMPTY));

        const editresumeInfo = await resumeService.editresume(resumeId, nickname)
        return res.send(editresumeInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const resumeIdResult = req.verifiedToken.resumeId;
    console.log(resumeIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
