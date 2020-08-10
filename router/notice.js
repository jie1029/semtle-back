const express = require('express');
const router = express.Router();
const Notice = require('../schemas/notice');
const multer = require('multer');
const format = require('../js/formatDate');

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Notice.find({}, { contents: false, image: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
        .then((noticeList) => {
            res.json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});


router.get('/detail/:id', (req, res) => {
    Notice.findOne({ _id: req.params.id }, { _id: false })
        .then((noticeList) => {
            res.json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});


var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        callback(null, format(new Date()) + '_' + file.originalname);
    }
});

var upload = multer({
    storage: imageStorage
});


router.post('/input', upload.single("img"), (req, res, next) => {

    var writer = req.body.writer;
    var date = req.body.date;
    var title = req.body.title;
    var contents = req.body.contents;
    var image;
    if(req.file != undefined)
        image = req.file.filename
    else image = null;

    Notice.create({
        writer: writer,
        date: date,
        image: image,
        title: title,
        contents: contents,
        view: 0
    }, function (err) {
        if (err) {
            console.log(err)
            res.json({ status: "error" });
        }
        else {
            res.json({ status: "success" });
        }
    });

});

module.exports = router;