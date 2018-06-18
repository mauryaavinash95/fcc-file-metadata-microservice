// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let destination = path.join(process.cwd(), `/uploads/`);

		if (!fs.existsSync(destination)) {
			fs.mkdirSync(destination);
		}
		cb(null, destination);
	},
	filename: (req, file, cb) => {
    console.log("Request is: ", req);
		req.body.filename = file.originalname;
		req.body.file = file;
		req.body.mimeType = file.mimetype;
		cb(null, req.body.filename);
	}
});
const upload = multer({ storage: storage });


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/api/upload", function(request, response, next){
    upload.single('upfile')(request, response, (err) => {
			if (err) {
				console.log("Error while uploading file: ", err);
				response.send("There was some error while uploading file");
			}
			else {
        console.log("File uploaded successfully");
        next();
			}
		});
}, function(request, response){
    response.send({"name": request.body.filename,"type":request.body.mimeType,"size":request.file.size})
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
