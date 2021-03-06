/**
 * Library version.
 */

exports.version = '2.0.1';

var https = require('https');
var url = require('url');
/**
 * Exports.
 */
 
module.exports = function() {
  var jobs = [];
  
  this.addJob = function(jobHash) {
    jobs.push(jobHash);
  };
  
  this.postJobs = function(callback) {
    
    var result;
    var body = JSON.stringify({ "json" : jobs });
    options = {
          "host": "api.blitline.com",
          "port": 443,
          "path": "/job",
          "method": "post",
          "headers": {
            'Content-Length': body.length,
            'Content-Type': 'application/json'
          },
          "rejectUnauthorized": true
        };
    options.agent = new https.Agent(options);
    jobs = [];
    req = https.request(options, function(res) {
        var result;
        result = [];
        res.on("data", function(chunk) {
          return result.push(chunk.toString());
        });
        res.resume();
        return res.on("end", function() {
          var data;
          try {
            data = JSON.parse(result.join(''));
          } catch (e) {
            return callback(e);
          }
          var error;
          data.results.forEach(function(result) {
            // Will only return the error for the last job for multiple jobs.
            if (result.error) error = new Error(result.error);
          });
          return callback(error, data);
        });
      });

      req.on("error", function(e) {
        console.log("ERROR:Blitline:ErrorHandler: ",e);
        return callback(e);
      });
      req.write(body);
      return req.end();
  }
}
