const express = require('express');
const app = express();

const authRoute = require('./p_routes/auth');

app.use('api/user', authRoute);

app.listen(3000, () => console.log('server up'));
