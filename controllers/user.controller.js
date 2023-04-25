const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { constants } = require('../constants/httpStatus');

const getUserByEmail = async (req, res) => {
    const { userEmail } = req.params;
    console.log(userEmail);
    console.log('cc');
};

// try {
//     if (!userName)
//         return res.status(501).send({ error: 'Invalid Username' });

//     UserModel.findOne({ userName }, function (err, user) {
//         if (err) return res.status(500).send({ err });
//         if (!user)
//             return res
//                 .status(501)
//                 .send({ error: "Couldn't Find the User" });

//         /** remove password from user */
//         // mongoose return unnecessary data with object so convert it into json
//         const { password, ...rest } = Object.assign({}, user.toJSON());

//         return res.status(201).send(rest);
//     });
// } catch (error) {
//     return res.status(404).send({ error: 'Cannot Find User Data' });
// }
// console.log('cc');
// };

//@desc get all users
//@route GET /api/users/
//@access private and admin role
const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        let newUsers = users.map((user) => {
            delete user._doc.password;
            return user;
        });
        res.status(constants.OK).send(newUsers);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

//@desc create a new user
//@route POST /api/users/
//@access private and admin role
const createUser = asyncHandler(async (req, res) => {
    const { userType, firstName, lastName, userName, email, password } =
        req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);
    console.log(hashedPassword);
    const user = new User({
        userType,
        fullName: lastName + ' ' + firstName,
        userName,
        email,
        password: hashedPassword,
    });

    try {
        const newUser = await user.save();
        res.status(constants.CREATE).json(newUser);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

//@desc get a user with id
//@route GET /api/users/:id
//@access private
const getUser = asyncHandler(async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'User not found' });
        }
        delete user._doc.password;
        res.json(user);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});
//@desc update a user with id
//@route POST /api/users/:id
//@access private
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(404).send(`No user with id: ${id}`);
    // }
    if (req.user.checkMySelf) {
        return res.status(constants.OK).json({ message: 'myself' });
    } else {
        return res.status(constants.OK).json({ message: 'not myself' });
    }
    let oldUser;
    try {
        oldUser = await User.findById(req.params.id);
        if (oldUser == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }

    const { avatar, userType, firstName, lastName, userName, email, password } =
        req.body;
    const user = new User({
        _id: id,
        avatar,
        userType: userType || oldUser.userType,
        firstName,
        lastName,
        userName,
        email: email || oldUser.email,
        password: password || oldUser.password,
    });

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {
            new: true,
        });

        delete updateUser._doc.password;
        res.send(updatedUser);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});
//@desc delete a user with id
//@route DELETE /api/users/:id
//@access private and admin role
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !User.findById(id)) {
        // return
        res.status(constants.NOT_FOUND);
        // .json({ message: `No user with id: ${id}` });
        throw new Error(`No user with id: ${id}`);
    }
    return res
        .status(constants.OK)
        .json({ message: `Delete user with id : ${id}` });
    try {
        await User.findByIdAndRemove(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserByEmail,
};
