var express = require('express');
var router = express.Router();
let jwt = require("jsonwebtoken");
const { checkJWTToken, checkTaskLength, checkPasswordMatches, checkUsernameDuplicate, checkIsGmail, checkIsJSON } = require('./middleware');

//import toDoController
const toDoModelController = require("../controllers/toDoModel.controller")
const loginModelController = require("../controllers/loginModel.controller")

//route to check if login is correct
router.post("/login", loginModelController.checkLogin)

//route to get the list of todo items
router.get("/toDoItems", checkJWTToken, toDoModelController.getToDoItems);

//route to create a new item (using post method)
router.post("/toDoItems", checkJWTToken, checkTaskLength, checkIsJSON, toDoModelController.createItem);

//route to delete an item
router.delete("/:id", checkJWTToken, toDoModelController.deleteItem);

//route to update an item by id
router.put("/:id", checkJWTToken, toDoModelController.updateItem);

//route to complete an item by id
router.put("/complete/:id", checkJWTToken, toDoModelController.completeItem);

//route to get log ins
router.get("/loginList", loginModelController.getLogins);

//route to register a new user (using post method)
router.post("/loginList", checkPasswordMatches, checkUsernameDuplicate, checkIsGmail, loginModelController.createLogin);

module.exports = router;
