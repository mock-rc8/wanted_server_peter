const jwtMiddleware = require("../../../config/jwtMiddleware");
const eventProvider = require("../../app/Event/eventProvider");
const eventService = require("../../app/Event/eventService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getEvents = async function(req, res){
    const tag1 = req.query.tag1; // 커리어고민, HR, 경영 비즈니스, 회사생활, 개발
    const tag2 = req.query.tag2; // Close-미, Clip-on, 이회사 어때요? 진단 테스트...
    console.log('tag1: ', tag1);
    console.log('tag2: ', tag2);
    const eventList = await eventProvider.retrieveEvent(tag1, tag2);
    return res.send(response(baseResponse.SUCCESS, eventList));
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
 * [POST] /app/events
 */
exports.postevents = async function (req, res) {

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


    const signUpResponse = await eventService.createevent(
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
 * [GET] /app/events
 */
exports.getevents = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const eventListResult = await eventProvider.retrieveeventList();
        return res.send(response(baseResponse.SUCCESS, eventListResult));
    } else {
        // 유저 검색 조회
        const eventListByEmail = await eventProvider.retrieveeventList(email);
        return res.send(response(baseResponse.SUCCESS, eventListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/events/{eventId}
 */
exports.geteventById = async function (req, res) {

    /**
     * Path Variable: eventId
     */
    const eventId = req.params.eventId;

    if (!eventId) return res.send(errResponse(baseResponse.event_eventID_EMPTY));

    const eventByeventId = await eventProvider.retrieveevent(eventId);
    return res.send(response(baseResponse.SUCCESS, eventByeventId));
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

    const signInResponse = await eventService.postSignIn(email, password);

    return res.send(signInResponse);
};





