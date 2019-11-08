const io = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const queries = require('./apiQueries.js');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

import {Container} from '../src/index.js';

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

const router = express.Router();
const server = http.createServer(app);

const ioServer = io(server);
let interval;

const serverRenderer = (req, res, next) => {
    fs.readFile(path.resolve('../dist/index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occured');
        }
        console.log('4564567')
        return res.send(data.replace('<div id="root"></div>', `<div id="root">${ReactDOMServer.renderToString(<Container />)}</div>`))
    });
};

router.use('^/$', serverRenderer);

router.use(
    express.static(path.resolve(__dirname, '..', 'dist'), { maxAge: '30d' })
)

app.use(router)

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
