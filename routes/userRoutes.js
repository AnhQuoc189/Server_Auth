const express = require('express');
const router = express.Router();

const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserByEmail,
} = require('../controllers/user.controller');
const {
    verifyAccessToken,
    verifyAdmin,
    verifyUserAuthorization,
} = require('../middleware/auth.middleware');

router.use(verifyAccessToken);
router.route('/').get(verifyAdmin, getUsers).post(verifyAdmin, createUser);
// router.route('/:userName').get(getUserByUserName); // user with username
router.get('/:email', getUserByEmail);
// router
//     .route('/:id')
//     .get(getUser)
//     .put(verifyUserAuthorization, updateUser)
//     .delete(verifyAdmin, deleteUser);

module.exports = router;
