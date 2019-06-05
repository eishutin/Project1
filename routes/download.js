var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
    var name = req.query.name;
    var filepath = path.normalize(__dirname + '/../files/' + name);
    fs.stat(filepath, function (err, stat) {
        if (err || !stat.isFile()) {
            if (err.code === 'ENOENT') {
                res.status(404);
            } else {
                res.status(500);
            }
            res.send(err);
            return;
        }
        res.sendFile(filepath);
    })
});

module.exports = router;
