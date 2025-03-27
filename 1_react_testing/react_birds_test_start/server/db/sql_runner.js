const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'sightings'
});

class SqlRunner {
    static run(sql, values = []){
        return pool.query(sql, values).then(results => results);
    }
}

module.exports = SqlRunner;