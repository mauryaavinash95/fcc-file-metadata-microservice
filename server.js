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
		let username = file.originalname;
		let savedFileName = file.originalname;
		req.body.file = file;
		req.body.file.savedFileName = savedFileName;
		req.body.file.username = username;
		cb(null, savedFileName);
	}
});
const upload = multer({ storage: storage });


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/api/upload", function(request, response){
    upload.single('upfile')(request, response, (err) => {
			if (err) {
				console.log("Error while uploading file: ", err);
				response.sendJson("There was some error while uploading file", 400);
			}
			else {
				console.log(`File saved successfully for`);
			}
		});
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
