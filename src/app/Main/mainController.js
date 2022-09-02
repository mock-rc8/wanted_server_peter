const jwtMiddleware = require("../../../config/jwtMiddleware");
const mainProvider = require("../../app/Main/mainProvider");
const mainService = require("../../app/Main/mainService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * [GET] /app/mains
 */
exports.getMain = async function (req, res) {

    const tag = req.query.tag;
    const mainListResult = await mainProvider.retrieveMainList(tag);

    return res.send(response(baseResponse.SUCCESS, mainListResult));
}
