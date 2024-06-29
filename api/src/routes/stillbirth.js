const express = require("express");
const _stillbirthController = require("../controllers/Stillbirthcertificate");
const multer = require('multer');
const { upload } = require('../helpers/uploader');
// const path = require('path');
const router = new express.Router();


router.post("/create", _stillbirthController.store);
router.post("/update", _stillbirthController.update);
router.get('/getAll', _stillbirthController.index);
router.get('/validate/', _stillbirthController.show);

module.exports = router;
