var geddy = require('geddy');
var environment = 'development'; // 'production';


geddy.start({
    environment: process.env.GEDDY_ENVIRONMENT || environment
});