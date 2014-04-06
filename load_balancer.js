var args = process.argv.splice(2);
var httpProxy = require('http-proxy');
var http = require('http');


var servers = args.splice(1);
var i = 0;

//http.createServer(function(req, res, proxy) {
  //proxy.proxyRequest(req, res, { target: addresses[i] });
  //i = (i + 1) % addresses.length;
//}).listen(args[0] || 8000);

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
  proxy.web(req, res, { target: servers[i] });
  i = (i + 1) % servers.length;
});

server.listen(8000);
