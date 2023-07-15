const jwt = require("jsonwebtoken")

const middleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(400).json({ msg: "Token not provided" });
        }
        const decoded = jwt.verify(token, "thor")
        if (!decoded) {
            return res.status(400).json({ msg: "invalid Credentials" });
        }
        req.userId = decoded.userId
        req.name = decoded.name
        next()

    } catch (error) {
        res.status(400).json({ msg: "Internal server error" })
    }
}

module.exports = middleware