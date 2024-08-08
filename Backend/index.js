const express = require('express')
const app = express()
const port = 3000;
const cors = require('cors');
const user = require('./routes/user');
const accounts = require('./routes/accounts');

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', user);

app.use('/api/v1/account', accounts);

app.listen(port, () => {
  console.log(`Paytm listening on port ${port}`)
})