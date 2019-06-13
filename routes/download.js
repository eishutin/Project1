const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async function (req, res) {
    const File = require('../lib/database').File;
    const name = req.query.name;
    const password = req.query.password;

    const filepath = path.normalize(__dirname + '/../files/' + name);
    fs.stat(filepath, async function (err, stat) {
        if (err || !stat.isFile()) {
            if (err.code === 'ENOENT') {
                res.status(404);
            } else {
                res.status(500);
            }
            return res.send(err);
        }
        const filedb = await File.findOne({name: name});

        if (password === filedb.password) {

            return res.sendFile(filepath);
        }
    })
});

module.exports = router;
