const jwtMiddleware = require("../../../config/jwtMiddleware");
const mainProvider = require("../../app/Main/mainProvider");
const mainService = require("../../app/Main/mainService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/mains
 */
exports.getMain = async function (req, res) {

    /*if (!email) {
        // 유저 전체 조회
        const mainListResult = await mainProvider.retrievemainList();
        return res.send(response(baseResponse.SUCCESS, mainListResult));
    } else {
        // 유저 검색 조회
        const mainListByEmail = await mainProvider.retrievemainList(email);
        return res.send(response(baseResponse.SUCCESS, mainListByEmail));
    }*/

    const tag = req.query.tag;
    const mainListResult = await mainProvider.retrieveMainList(tag);
    return res.send(response(baseResponse.SUCCESS), mainListResult);

}


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const mainIdResult = req.verifiedToken.mainId;
    console.log(mainIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
