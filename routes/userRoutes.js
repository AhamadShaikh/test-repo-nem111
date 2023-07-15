const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken")
const BlacklistToken = require("../model/blacklistModel")

router.get("/", (req, res) => {
    try {
        res.status(200).send("welcome users route")
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" })
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, gender, password, age, city, is_married } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(200).json({ msg: "Registered Successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Register First" });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({ msg: "Wrong Credentials" });
        }

        const token = jwt.sign({ userId: user._id, name: user.name }, "thor", { expiresIn: "1d" })

        const rtoken = jwt.sign({ userId: user._id, name: user.name }, "thanos", { expiresIn: "3d" })

        res.status(200).json({ msg: "Login Successfully", token: token, refreshToken: rtoken });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(400).json({ msg: "Token not provided" });
        }

        const isBlacklisted = await BlacklistToken.exists({ token });
        if (isBlacklisted) {
            return res.status(400).json({ error: 'Token has already been invalidated' });
        }

        await BlacklistToken.create({ token });

        res.status(200).json({ msg: 'User has been logged out' });
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" });
    }
});

module.exports = router