var generic_pool = require('generic-pool');
var mysql = require('mysql');

var dbinfo = require("./db.json");

console.log(dbinfo);

var pool = generic_pool.Pool({
  name: 'mysql',
  create: function(callback) {
    var config = {
      host: dbinfo.host,
      port: dbinfo.port,
      user: dbinfo.user,
      password: dbinfo.password,
      database: dbinfo.database
    };

    var client = mysql.createConnection(config);
    client.connect(function (err) {
      if (err) {
        console.log(err);
      }
      callback(err, client);
    });
  },
  destroy: function(client) {
    client.end();
  },
  min: 4,
  max: 10,
  idleTimeoutMillis: 300000,
  log: true

});

process.on('exit', function() {
  pool.drain(function() {
    pool.destroyAllNow();
  });
});

module.exports = pool;