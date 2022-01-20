process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const { PORT = 5555 } = process.env;

app.use(cors({
	credentials: true,
	origin: true
}));

app.all('/*', async (req, res, next) => {
	try {
		const result = await axios({
			method: req.method,
			url: req.params[0],
			data: req.body
		});
		res.send(result.data);
	} catch (e) {
		next(e);
	}
});

app.use((error, req, res) => {
	const statusCode = error.status || 500;
	return res.status(statusCode).json({
		status: statusCode === 500 ? 'fail' : 'error',
		code: statusCode,
		message: error.message || 'Unexpected error'
	});
});

app.listen(PORT, () => {
	console.log(`App starts on port ${PORT}`);
});
