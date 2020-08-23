const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');
const Student = require('../schemas/student');
const { formatDateSend } = require('../js/formatDateSend');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { findWriter } = require("./middlewares/findWriter");

router.get('/:questionid', (req, res) => {
    answer.findByQuestionId(req.params.questionid)
        .then((answers) => {

            if (answers.length === 0) {
                console.log("No answer");
                res.status(500).json({ status: "error" });
            } else {
                answers.forEach(async (element, index) => {
                    // console.log(element);
                    if (element.writer !== "관리자") {
                        await Student.find({ nick: element.writer })
                            .then((sts) => {
                                console.log("test:", index)
                                // console.log(sts[0].image);
                                element.writerImage = sts[0].image;
                                // console.log(element)
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({ status: "error" });
                            });
                    }
                    else {
                        element.writerImage = 'default.jpg';
                    }
                    console.log("index: ", index)

                    if (index === answers.length - 1) {
                        //console.log("taese0ng: ")
                        res.send({ answers: answers });
                    }
                })
            }


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.post('/', verifyToken, findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = formatDateSend(new Date())
    answer.create(req.body)
        .then(() => res.json({ status: "success" }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.delete('/:answerid', verifyToken, adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

module.exports = router;