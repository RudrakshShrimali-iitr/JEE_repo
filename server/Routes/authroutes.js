const router = require('express').Router();
const { signup } = require("../controllers/authcontroller");
const { signupValidation } = require("../middlewares/authvalidation");
const { login } = require("../controllers/authcontroller");
const { loginupValidation } = require("../middlewares/authvalidation");
   

router.post('/signup',signupValidation,signup);
router.post('/loginup',loginupValidation,login);
   
module.exports=router;