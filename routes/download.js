const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passwordHash = require('password-hash');
const salt = '$2b$31$pnU5ODd.F3Kk7TUy5tWhR.$2b$31$pnU5ODd.F3Kk7TUy5tWhR.';

router.get('/', async function (req, res) {
    const File = require('../lib/database').File;
    const name = req.query.id;
    const password = req.query.password;
    const version = req.query.version;

    if (!name) {
        return res.status(400).send('No id');
    }

    if (!password) {
        return res.status(400).send('No password');
    }
    try {
        const filever = await File.count({name: name});
            if(!version){
                const filedb = await File.findOne({name: name, version: filever});
                if (passwordHash.verify(password + salt, filedb.password)) {
                        return res.sendFile(filedb.path);
                } else return res.status(400).send('Invalid password')

        } else {
            if (version >=1 && version <= filever) {
                const filedb = await File.findOne({name: name, version: version});
                if (passwordHash.verify(password + salt, filedb.password)) {
                    return res.sendFile(filedb.path);
                } else return res.status(400).send('Invalid password');
            } else return res.status(400).send('Invalid version');
        }
        } catch (e) {
            return res.status(500).send(e);
        }
});

module.exports = router;
