const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
    const name = req.query.name;
    const filepath = path.normalize(__dirname + '/../files/' + name);
    fs.stat(filepath, function (err, stat) {
        if (err || !stat.isFile()) {
            if (err.code === 'ENOENT') {
                res.status(404);
            } else {
                res.status(500);
            }
            return res.send(err);
        }
        res.sendFile(filepath);
    })
});

module.exports = router;
