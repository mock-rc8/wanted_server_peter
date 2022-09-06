const jwtMiddleware = require("../../../config/jwtMiddleware");
const resumeProvider = require("../../app/Resume/resumeProvider");
const resumeService = require("../../app/Resume/resumeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
/**
 *[GET] /app/resumes/:useridx
 *
 */
exports.getResumeByUser = async function (req, res) {
    const userIdx = req.params.useridx;
    const resumeUserResult = await resumeProvider.retrieveResume(userIdx);

    return res.send(response(baseResponse.SUCCESS, resumeUserResult));
}

// 이력서 생성
exports.postResumeByUser = async function (req, res) {
    const userIdx = req.params.useridx;

    /*const {title, name, email, phone, aboutMe, skill,  // Resume
        careerStart, careerEnd, company, workType, department, duty, careerIsCurrent, // ResumeCareer
        performance, performanceStart, performanceEnd, content, // ResumePerformance
        educationStart, educationEnd, school, major, finishClass, eduIsCurrent, // ResumeEducation
        prizeDate, activityName, activityDetail, // ResumePrize
        language, langClass, // ResumeLanguage
        testName, score, testDate, // ResumeLangTest
        link // ResumeLink
    } = req.body;*/

    const {title, name, email, phone, aboutMe, skill} = req.body;
    const postResumeParams = [userIdx, title, name, email, phone, aboutMe, skill];

    const postResumeResult = await resumeService.postResume(postResumeParams);
    return res.send(response(postResumeResult));
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

exports.getresumeById = async function (req, res) {

    /**
     * Path Variable: resumeId
     */
    const resumeId = req.params.resumeId;

    if (!resumeId) return res.send(errResponse(baseResponse.resume_resumeID_EMPTY));

    const resumeByresumeId = await resumeProvider.retrieveresume(resumeId);
    return res.send(response(baseResponse.SUCCESS, resumeByresumeId));
};