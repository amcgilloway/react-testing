const express = require('express');
const cors = require('cors');
const createRouter = require('./helpers/create_router.js');


const app = express();
app.use(express.json());
app.use(cors());

const sightingRouter = createRouter();
app.use('/api/sightings', sightingRouter);

const server = app.listen(5000, ( ) => {
  console.log("App running")
})

module.exports = server
