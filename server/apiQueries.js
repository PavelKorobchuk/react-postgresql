const Pool = require('pg').Pool;
const postgresConfig = require('./postgresConfig.js');
const pool = new Pool(postgresConfig);

const getCities = (cb) => {
    pool.query('SELECT * FROM locations ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      cb(results.rows);
    })
}

/**
 * Get request for PostgreSQL and Node socket.io
 */
const getServers = (id, cb) => { 
  pool.query('SELECT * FROM servers WHERE city_id = $1 ORDER BY id ASC', [id], (error, servers) => {
    if (error) {
      throw error
    }

    pool.query('SELECT name FROM locations WHERE id = $1', [id], (error, locations) => {
      if (error) {
        throw error
      }
      return cb([servers.rows, locations.rows])
    })
  })
}

const addServer = (server, cb) => {
  const { name, health, admin_state, city_id } = JSON.parse(server);
  pool.query('INSERT INTO servers(name, health, admin_state, city_id) VALUES($1, $2, $3, $4)', [name, health, admin_state, city_id], (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
    
    return cb()
  })
}

const  getServerInfo = (id, cb) => {
  pool.query('SELECT * FROM servers WHERE id = $1', [id], (error, servers) => {
    if (error) {
      throw error
    }
    return cb(servers.rows)
  })
}

module.exports = {
    getCities,
    getServers,
    addServer,
    getServerInfo
}