const express = require('express');
const router = express.Router();
const path = require('path');
const uuid = require('uuid/v4');
const passwordHash = require('password-hash');
const salt = '$2b$31$pnU5ODd.F3Kk7TUy5tWhR.$2b$31$pnU5ODd.F3Kk7TUy5tWhR.';

router.post("/", async function (req, res) {
    const File = require('../lib/database').File;

    const name = req.query.id;
    const password = req.query.password;
    if (!name) {
        return res.status(400).send('Name is invalid.');
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (!password) {
        return res.status(400).send('Password is invalid.');
    }
    const filever = await File.count({name: name});
    const filedb = await File.findOne({name: name, version: filever});

    const sampleFile = req.files[Object.keys(req.files)[0]];

    if(sampleFile.size>200*1024){
        return res.status(400).send('file size is more than 200kb');
    }

    const filepath = path.normalize(__dirname + '/../files/' + uuid());
    if (!filedb) {
        sampleFile.mv(filepath, async function (err) {
            if (err)
                return res.status(500).send(err + 'sadfg');
            try {
                const filehash = passwordHash.generate(password + salt);
                console.log(filehash);
                await File.create({name: name, password: filehash, path: filepath, version: 1});
                return res.send('File uploaded!');
            } catch (e) {
                return res.status(500).send(err + 'qwerty');
            }
        });
    } else {
        if(passwordHash.verify(password + salt, filedb.password)){
            sampleFile.mv(filepath, async function (err) {
                if (err)
                    return res.status(500).send(err);
                try {
                    await File.create({name: name, password: filedb.password, path: filepath, version: filever + 1});
                } catch (e) {
                    return res.status(500).send(err);
                }
            });
            return res.send('File updated!');
        } else {
            return res.status(400).send('Password is invalid.');
        }}
});

module.exports = router;
