const express =require("express");
const { createUser } = require("../controllers/StoreController");
const { allUser } = require("../controllers/StoreController");
const { updateUser } = require("../controllers/StoreController");
const { deleteUser } = require("../controllers/StoreController");

const router = express.Router();

router.route("/store/new").post(createUser);
router.route("/stores").get(allUser);
router.route("/store/:id").put(updateUser);
router.route("/store/:id").delete(deleteUser);


module.exports  = router