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