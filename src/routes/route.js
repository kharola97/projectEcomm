const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.all("/*", (req, res) => res.status(404).send("Page not found."));

module.router = router;