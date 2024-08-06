const express = require('express')
const app = express()
const port = 3000;
const cors = require('cors');
const user = require('./routes/user');

app.use(express.json());
app.use(cors());

app.use('/user', user);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})