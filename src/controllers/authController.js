const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authController = {
    login: async(req, res) => {
        const {email, password} = req.body;

        if (!(email && password)) {
            return res.status(400).json({ error: "All fields are required" })
        }
        
        try {
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(401).json({message: "User does not exist"})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(isMatch){
                const payload = {
                    id: user._id,
                    email: user.email
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 24*60*60});
                return res.status(200).json({success:"Successfully logged in", user:user,token: `Bearer ${token}`})
            }
        } catch (error) {
            res.status(401).json({message: "Invalid credentials"})
        }
    },
    register: async (req, res) => {
        const { username, email, password } = req.body;

        if (!(username && email && password)) {
            return res.status(400).json({ error: "All fields are required" })
        }

        try {
            const userExist = await User.findOne({ email: email });
            if (userExist) return res.status(400).json({ message: "User already exists" })
            
            const hashPassword = await bcrypt.hash(password, 10);
            console.log(req.file);
            const user = await User.create({
                username,
                email,
                password: hashPassword,
                profile: {
                    username,
                    avatar: req.file && req.file.path,
                },
            })
            res.status(201).json({ success: "User created successfully", user })
        } catch (error) {
            res.status(500).json({ error })
        }
    }
}

module.exports = authController;