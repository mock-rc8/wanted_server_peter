const jwtMiddleware = require("../../../config/jwtMiddleware");
const recruitProvider = require("../../app/Recruit/recruitProvider");
const recruitService = require("../../app/Recruit/recruitService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const {decode} = require("jsonwebtoken");

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
 * [POST] /app/recruits
 */
exports.postrecruits = async function (req, res) {

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


    const signUpResponse = await recruitService.createrecruit(
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
 * API Name :
 * [GET] /app/recruits
 */
exports.getRecruits = async function (req, res) {

    const userIdx = req.params.useridx; // 패스 베리어블로 받는 회원 인덱스

    const tag1 = req.query.tag1;
    const tag2 = req.query.tag2;

    const recruitListResult = await recruitProvider.retrieveRecruitList(userIdx, tag1, tag2);
    return res.send(response(baseResponse.SUCCESS, recruitListResult));
};

// 로그인 안했을 경우 채용페이지 조회
exports.getRecruitsNogLogged = async function(req, res) {
    const tag1 = req.query.tag1;
    const tag2 = req.query.tag2;

    const recruitListResult = await recruitProvider.retrieveRecruitNotLoggedList(tag1, tag2);
    return res.send(response(baseResponse.SUCCESS, recruitListResult));
}

exports.getRecruitInfo = async function (req, res){

    const nationIdx = req.params.nation;
    const locationIdx = req.params.location;
    const locationDetailIdx = req.params.locationdetail;
    const careerStart = req.params.careerstart;
    const careerEnd = req.params.careerend;
    const jobGroupIdx = req.params.jobgroupidx;
    const jobIdx = req.params.jobidx;

    const recruitInfoPathVariable = [nationIdx, locationIdx, locationDetailIdx, careerStart, careerEnd, jobGroupIdx, jobIdx];

    const recruitInfoResult = await recruitProvider.retrieveRecruitInfoList(recruitInfoPathVariable);

    return res.send(response(baseResponse.SUCCESS, recruitInfoResult));
}

exports.patchBookmark = async function(req, res){
    const userIdx = req.params.useridx;
    const recruitIdx = req.params.recruitidx;
    console.log('userIdx: ', userIdx);
    console.log('recruitIdx: ', recruitIdx);
    const recruitBookmarkResult = await recruitService.patchRecruitBookmark(userIdx, recruitIdx);
    return res.send(response(baseResponse.SUCCESS, recruitBookmarkResult));
}

