const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async function (req, res) {
    const File = require('../lib/database').File;
    const name = req.query.name;
    const password = req.query.password;
    const version = req.query.version;

    const filepath = path.normalize(__dirname + '/../files/' + name);
    fs.stat(filepath,  async function (err, stat) {
        if (err || !stat.isFile()) {
            if (err.code === 'ENOENT') {
                res.status(404);
            } else {
                res.status(500);
            }
            return res.send(err);
        }
        const filever = await File.count({name: name});
        if(!version){
            const filedb = await File.findOne({name: name, ver: filever});
            if (password === filedb.password) {
                return res.sendFile(filedb.path);
            }
        } else {
            if (1 <= version && version <= filever) {
                const filedb = await File.findOne({name: name, ver: version});
                    if (password === filedb.password) {
                        return res.sendFile(filedb.path);
                    } else return res.status(403).send('Invalid password');
                } else return res.status(403).send('Invalid version');
            }


    })
});

module.exports = router;
