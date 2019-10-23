const io = require('socket.io');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const queries = require('./apiQueries.js');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

const server = http.createServer(app);

const ioServer = io(server);
let interval;
ioServer.sockets.on('connection', (socket) => {
    /**
     * Query API's
     */
    socket.on('initial_locations', _ => {
        queries.getCities(data => {
            ioServer.sockets.emit("get_locations", data);
        })
    });
    socket.on('initial_server_data', (city_id) => {
        queries.getServers(city_id, (data) => {
            ioServer.sockets.emit("get_server_data", data);
        })
    });

    socket.on('add_server', (server, cb) => {
        queries.addServer(server, () => {
            ioServer.sockets.emit("change_server_data");
            cb();
        })
    });

    socket.on('initial_server_info', (city_id) => {
        queries.getServerInfo(city_id, (data) => {
            ioServer.sockets.emit("get_server_info", data);
        })
    });

    socket.on('initial_notifications', duration => {
        if (interval) clearInterval(interval);

        interval = setInterval(_ => {
            queries.getCities((data) => {
                ioServer.sockets.emit('get_notifications', data);
            })
        }, duration || 30000);
    });

    socket.on('disconnect',  () => {
        clearInterval(interval)
      });
});

/**
 * Web server running
 */
server.listen('5000', () => console.log(`Listening on port 5000`));
