const express = require('express');
const router = express.Router();
const path = require('path');


router.post("/", async function (req, res) {
    const File = require('../lib/database').File;

    const name = req.query.name;
    const password = req.query.password;
    if (!name) {
        return res.status(400).send('Name is invalid.');
    }
    if (Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (!password) {
        return res.status(400).send('Password is invalid.');
    }

    const filedb = await File.findOne({name: name});
    if (!filedb) {
        const sampleFile = req.files[Object.keys(req.files)[0]];
        const filepath = path.normalize(__dirname + '/../files/' + name);
        sampleFile.mv(filepath, async function (err) {
            if (err)
                return res.status(500).send(err);
            await File.create({name: name, password: password, path: filepath});
            res.send('File uploaded!');
        });
    } else {
        if (password === filedb.password) {
            const sampleFile = req.files[Object.keys(req.files)[0]];
            sampleFile.mv(path.normalize(__dirname + '/../files/' + name), function (err) {
                if (err)
                    return res.status(500).send(err);
            });
            return res.send('File updated!');
        } else {
            return res.status(400).send('Password is invalid.');
        }
    }
});

module.exports = router;
