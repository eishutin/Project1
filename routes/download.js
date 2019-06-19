const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async function (req, res) {
    const File = require('../lib/database').File;
    const name = req.query.name;
    const password = req.query.password;
    const version = req.query.version;

    if (!name) {
        return res.status(400).send('No name');
    }

    if (!password) {
        return res.status(400).send('No password');
    }
    try {
        const filever = await File.count({name: name});
            if(!version){
                const filedb = await File.findOne({name: name, ver: filever});

                if (password === filedb.password) {
                        return res.sendFile(filedb.path);
                } else return res.status(400).send('Invalid password')

        } else {
            if (version >=1 && version <= filever) {
                const filedb = await File.findOne({name: name, ver: version});
                if (password === filedb.password) {
                    return res.sendFile(filedb.path);
                } else return res.status(400).send('Invalid password');
            } else return res.status(400).send('Invalid version');
        }
        } catch (e) {
            return res.status(500).send(e);
        }
});

module.exports = router;
