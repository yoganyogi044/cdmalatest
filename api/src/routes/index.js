const express = require("express");
const _birthRoute = require("./birth")
const _deathRoute = require("./death")
const _stillbirthRoute = require("./stillbirth");
const router = new express.Router();
/**
 * Primary app routes.
 */
router.use("/birthcertificate", _birthRoute);
router.use("/deathcertificate", _deathRoute);
router.use("/stillbirthcertificate", _stillbirthRoute);
module.exports = router;
