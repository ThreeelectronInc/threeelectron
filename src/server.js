/*

const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
*/


// /* node-static-file-server.js 


var path = require('path');
var fs = require('fs');


// 
// Configuration 
// 

var config = {
    
    // www root
    root: 'dist',

    // default file to serve
    index: 'index.html',

    // http listen port
    port: process.env.PORT || 3000

};


// 
// HTTP Server
// 

require('http').createServer(function (request, response) {
    var file = path.normalize(config.root + request.url);
    file = (file == config.root + '/') ? file + config.index : file;

    console.log('Trying to serve: ', file);

    function showError(error) {
        console.log(error);

        response.writeHead(500);
        response.end('Internal Server Error');
    }

    fs.exists(file, function (exists) {
        if (exists) {
            fs.stat(file, function (error, stat) {
                var readStream;

                if (error) {
                    return showError(error);
                }

                if (stat.isDirectory()) {
                    response.writeHead(403);
                    response.end('Forbidden');
                }
                else {
                    readStream = fs.createReadStream(file);

                    readStream.on('error', showError);

                    response.writeHead(200);
                    readStream.pipe(response);
                }
            });
        }
        else {
            response.writeHead(404);
            response.end('Not found');
        }
    });

}).listen(config.port, function() {
    console.log('Server running at http://localhost:%d', config.port);
});
// */