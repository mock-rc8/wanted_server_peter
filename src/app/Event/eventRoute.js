module.exports = function(app){
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');



    // 1. 유저 생성 (회원가입) API
    //app.post('/app/events', event.postevents);


    // 2. 유저 조회 API (+ 검색)
    //app.get('/app/events',event.getevents);

    // 3. 특정 유저 조회 API
    // app.get('/app/events/:eventId', event.geteventById);


   app.get('/app/events', event.getEvents);



};