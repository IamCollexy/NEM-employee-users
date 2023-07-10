const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    usersController.createUser
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    usersController.updateUserById
  );

router
  .route('/users/:id')
  .get(usersController.getUserById)
  .delete(
    verifyRoles(ROLES_LIST.Admin),
    usersController.deleteUserById
  );

module.exports = router;
