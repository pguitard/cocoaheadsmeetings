var application_root = __dirname,
	express = require("express"),
	path = require("path"),
	mongoose = require("mongoose");

var app = express();

// Config
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// app.use(app.router);
	// app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Database
mongoose.connect('mongodb://localhost/cocoaheads_database');

// Schema
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
	date: { type: Date, required: true },
	location: { type: String, required: true },
	agenda: { type: String },
	modified: { type: Date, default: Date.now }
});

// Validations
MeetingSchema.path('date').validate(function (v) {
    now = new Date();
    return v > now;
}, 'Meeting date should be in the future');

// Model
var MeetingModel = mongoose.model('Meeting', MeetingSchema);
 
// URLs
app.get('/api', function(req, res) {
	res.send('Cocoaheads Meetings API is running');
});

app.get('/api/meetings', function(req, res) {
	return MeetingModel.find(function(err, meetings) {
		if (!err) {
			return res.send(meetings);
		} else {
			return console.log(err);
		}
	});
});

app.post('/api/meetings', function(req, res) {
	var meeting;

	console.log("POST: ");
	console.log(req.body);

	meeting = new MeetingModel({
		date: req.body.date,
		location: req.body.location,
		agenda: req.body.agenda
	});

	meeting.save(function(err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});

	return res.send(meeting);
});

app.get('/api/meetings/:id', function(req, res) {
	return MeetingModel.findById(req.params.id, function(err, meeting) {
		if (!err) {
			return res.send(meeting);
		} else {
			return console.log(err);
		}
	});
});

app.put('/api/meetings/:id', function(req, res) {
	return MeetingModel.findById(req.params.id, function(err, meeting) {
		meeting.date = req.body.date;
		meeting.location = req.body.location;
		meeting.agenda = req.body.agenda;
		meeting.modified = new Date();

		return meeting.save(function(err) {
			if (!err) {
				console.log("updated");
			} else {
				console.log(err);
			}

			return res.send(meeting);
		});
	});
});

app.delete('/api/meetings/:id', function(req, res) {
	return MeetingModel.findById(req.params.id, function(err, meeting) {
		return meeting.remove(function(err) {
			if (!err) {
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});

// Launch Server
app.listen(app.get('port'));

console.log('Server listening on port ' + app.get('port'));