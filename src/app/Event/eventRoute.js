module.exports = function(app){
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


   app.get('/app/events', event.getEvents);

};