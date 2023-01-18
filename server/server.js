var express = require('express');
var app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
var server = app.listen(port);

app.get('/api', function (req, res) {
	res.status(200).json({ status: 'UP' });
});
