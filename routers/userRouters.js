const {
  register,
  login,
  setAvatar,
  getAllUser,
  logOut,
} = require("../controller/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUser); //
router.get("/logout/:id", logOut);

module.exports = router;
