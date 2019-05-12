const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my__simple_database', {useNewUrlParser: true}).then(() => {
	console.log("DB is connected");
});

