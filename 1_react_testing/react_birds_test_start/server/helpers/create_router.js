const express = require('express');
const SqlRunner = require('../db/sql_runner');

const createRouter = function(){
  const router = express.Router();

/* GET all sightings. */
router.get('/', function(req, res) {
  const sql = "SELECT * FROM sightings;"
  SqlRunner.run(sql)
  .then(result => res.json(result.rows))
});

/* GET sighting with :id. */
router.get('/:id', function(req, res) {
 const sql = "SELECT * FROM sightings WHERE id = $1;"
 const values = [req.params.id];
 SqlRunner.run(sql, values)
 .then(result => res.json(result.rows[0]));
});

/* Create a new sighting. */
router.post('/', function(req, res) {
  const sql = "INSERT INTO sightings (species, location, date) values ($1, $2, $3) RETURNING *;"
  const values = [req.body.species, req.body.location, req.body.date];
  SqlRunner.run(sql, values)
  .then(result => res.json(result.rows[0]))
});

/* UPDATE the sighting with :id */
router.put('/:id', function(req, res) {
  const sql = "UPDATE sightings SET (species, location, date) = ($1, $2, $3) WHERE id = $4 returning *;"
  const values = [req.body.species, req.body.location, req.body.date, req.params.id];
  SqlRunner.run(sql, values)
  .then(result => res.json(result.rows[0]))
});

/* DELETE the sighting with id :id */
router.delete('/:id', function(req, res) {
  const sql = "DELETE FROM sightings WHERE id = $1;"
  const values = [req.params.id];
  SqlRunner.run(sql, values)
  .then(result => res.json(result));
});

return router;
}


module.exports = createRouter;