const express = require("express");
const router = express.Router();
const { getUsers, getUser, postUser, putUser, deleteUser } = require("../controllers/Users");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", postUser);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

module.exports = router;
