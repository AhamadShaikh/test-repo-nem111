const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
require("dotenv").config()
const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")

app.use(express.json())

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
    }
}

app.use("/user", userRouter)
app.use("/posts", postRouter)

app.listen(7000, () => {
    try {
        connection()
        console.log("listening port on 7000")
    } catch (error) {
        console.log(error)
    }
})