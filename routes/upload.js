const express = require('express');
const router = express.Router();
const path = require('path');

router.post("/", function (req, res) {
    const name = req.query.name;
    if (!name) {
        return res.status(400).send('Name is invalid.');
    }
    if (Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const sampleFile = req.files[Object.keys(req.files)[0]];

    sampleFile.mv(path.normalize(__dirname + '/../files/' + name), function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

module.exports = router;
