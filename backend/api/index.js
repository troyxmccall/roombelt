const router = require("express-promise-router")();

router.get("/version", (req, res) => res.json({ version: process.env["ROOMBELT_API_VERSION"] }));

router.use(require("./auth"));
router.use(require("./admin"));
router.use(require("./device"));
router.use(require("./paddle"));

module.exports = router;
