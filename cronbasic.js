var CronJob = require('cron').CronJob;
const axios = require('axios');
const winston = require('winston');

var dateStr = new Date().toISOString().slice(0,10);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: `log-${dateStr}.log` 
        })
    ]
});


logger.log({
    level: 'info',
    message: 'Hello distributed log files!'
});

logger.info('Hello again distributed logs');

console.log('Before job instantiation');
const job = new CronJob('0 */1 * * * *', function () {
    const d = new Date();
    console.log('Every minute:', d);
    // Make a request for a user with a given ID
    axios.get('http://10.155.33.67:8081/ws-ipop/service/back-office/data?hieLevel=true&level=1&salesOrg=F100&type=csCumulative&key=A1')
        .then(function (response) {
            // handle success
            console.log(JSON.stringify(response.data, undefined, 2));
            logger.info(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
});
console.log('After job instantiation');
job.start();