const jwtMiddleware = require("../../../config/jwtMiddleware");
const communityProvider = require("../../app/community/communityProvider");
const communityService = require("../../app/community/communityService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getCommunities = async function(req, res) {

    const communityListResult = await communityProvider.retrieveCommunityList();

    return res.send(response(baseResponse.SUCCESS, communityListResult));
}


/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/communitys
 */
exports.postcommunitys = async function (req, res) {

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


    const signUpResponse = await communityService.createcommunity(
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
 * [GET] /app/communitys
 */
exports.getcommunitys = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const communityListResult = await communityProvider.retrievecommunityList();
        return res.send(response(baseResponse.SUCCESS, communityListResult));
    } else {
        // 유저 검색 조회
        const communityListByEmail = await communityProvider.retrievecommunityList(email);
        return res.send(response(baseResponse.SUCCESS, communityListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/communitys/{communityId}
 */
exports.getcommunityById = async function (req, res) {

    /**
     * Path Variable: communityId
     */
    const communityId = req.params.communityId;

    if (!communityId) return res.send(errResponse(baseResponse.community_communityID_EMPTY));

    const communityBycommunityId = await communityProvider.retrievecommunity(communityId);
    return res.send(response(baseResponse.SUCCESS, communityBycommunityId));
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

    const signInResponse = await communityService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/communitys/:communityId
 * path variable : communityId
 * body : nickname
 */
exports.patchcommunitys = async function (req, res) {

    // jwt - communityId, path variable :communityId

    const communityIdFromJWT = req.verifiedToken.communityId

    const communityId = req.params.communityId;
    const nickname = req.body.nickname;

    if (communityIdFromJWT != communityId) {
        res.send(errResponse(baseResponse.community_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.community_NICKNAME_EMPTY));

        const editcommunityInfo = await communityService.editcommunity(communityId, nickname)
        return res.send(editcommunityInfo);
    }
};

exports.postCommunity = async function(req, res) {
    //const userIdx = req.params.useridx;
    //const postCommunityInfo = req.body;
    //console.log(postCommunityInfo);

    const {userIdx, empathy, interest, trend, nickname, title, content, imgUrl} = req.body;
    const postCommunityInfo = [userIdx, empathy, interest, trend, nickname, title, content, imgUrl];
    console.log('postCommunityInfo: ', postCommunityInfo);
    const postCommunityResult = await communityService.postCommunity(postCommunityInfo);

    return res.send(postCommunityResult);
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const communityIdResult = req.verifiedToken.communityId;
    console.log(communityIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
