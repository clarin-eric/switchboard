var express =   require("express");
var multer  =   require('multer');
var app     =   express();

var fs = require('fs');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
	callback(null, '/tmp');
    },
    filename: function (req, file, callback) {
	callback(null, file.originalname);
    }
});

//var upload = multer({ storage : storage}).single('langResource');
var upload = multer({ storage : storage});

app.use(function (req, res, next) {
    function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);

	console.log('hook', req);
	const fileToDelete = '/tmp/'+req.file.name;
	fs.stat(fileToDelete, function(err, data) {
	    console.log('req', req);
            if (err || req.url=='/') {
                console.log('file does not exist, or requested index.html:', fileToDelete);
	    } else {
		fs.unlinkSync(fileToDelete);		
                console.log('file has been deleted', fileToDelete); 
            }}); 
    }

    res.on('finish', afterResponse);
    res.on('close', afterResponse);

    next();
});

app.use('/nexpress', express.static('/tmp'));
//app.use(express.static('/tmp'));

// Allow cross origin resource sharing (CORS) within our application
/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/

// tackle CORS-related issues
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	// res.setHeader('Access-Control-Allow-Origin', 'http://vpn2111.extern.uni-tuebingen.de:3000');
	res.setHeader('Access-Control-Allow-Origin', 'http://weblicht.sfs.uni-tuebingen.de');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	// res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
    });

app.get('/nexpress/',function(req,res){
	res.sendFile(__dirname + "/index.html");
    });

app.post('/nexpress/api/upload', upload.single('langResource'), function(req,res){
    console.log('in post', req.file);
    upload.single('langResource')(req,res,function(err) {
	if (err) {
	    if (err instanceof multer.MulterError) {
		console.log('We have a multer error', err);
	    } else if (err) {
		console.log('We have another error', err);
		return res.end("Error uploading file.");
	    }
	}
	console.log('uploaded file');
	res.status(200).send( true );
	res.end("File is uploaded!");
    });
});

app.listen(8011,function(){
	console.log("Working on port 8011");
    });