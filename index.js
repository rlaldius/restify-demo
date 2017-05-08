var restify = require('restify');
var mongoose = require('mongoose');
var restifyMongoose = require('restify-mongoose');

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

mongoose.connect('mongodb://192.168.99.100/restful');

var ProductSchema = mongoose.Schema({
	name: String,
	sku: String,
	price: Number
});

var ProductSchema = mongoose.model('products', ProductSchema);
var Products = restifyMongoose(ProductSchema);

server.get('/products', Products.query());
server.get('/products/:id', Products.detail());
server.post('/products', Products.insert());
server.patch('/products/:id', Products.update());
server.del('/products/:id', Products.remove());


// --------------------------------------------------------------

function send(req, res, next) {
   res.send('hello ' + req.params.name);
   return next();
}

server.head('/hello/:name', send);
server.get('/hello/:name', send);
server.get(/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/, function(req, res, next) {
  console.log(req.params[0]);
  console.log(req.params[1]);
  res.send(200);
  return next();
});

server.put('/hello', send);

server.post('/hello', function create(req, res, next) {
   res.send(201, Math.random().toString(36).substr(3, 8));
   return next();
});

server.del('hello/:name', function rm(req, res, next) {
   res.send(204);
   return next();
});


// --------------------------------------------------------------

// Start Server
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});