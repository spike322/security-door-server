const Pool = require('pg').Pool
exports.pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB
})