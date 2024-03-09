const User = require("../models/userSchema");

// ############################### GET ALL USERS #######################################
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// ############################### GET SPECIFIC USER ###################################
const getUserById = async(req, res) => {
    const userId = req.params.id;

    if(!userId){
        return res.status(400).json({message:"id is required"})
    }

    try {
        const user = await User.findOne({_id: userId});
        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({message: "Failed to get the user"})
    }
}

module.exports = {
    getUserById,
    getAllUsers
}