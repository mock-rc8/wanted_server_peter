module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 메인 화면 조회 API
    app.get('/app/mains', main.getMain);

};