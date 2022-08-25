module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 유저 생성 (회원가입) API
    //app.post('/app/mains', main.postmains);


    // 2. 유저 조회 API (+ 검색)
    // app.get('/app/mains',main.getmains);

    // 3. 특정 유저 조회 API
    // app.get('/app/mains/:mainId', main.getmainById);

    // 메인 화면 조회 API
    app.get('/app/mains', main.getMain);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, main.check);

// TODO: 탈퇴하기 API