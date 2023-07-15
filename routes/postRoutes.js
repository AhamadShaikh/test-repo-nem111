const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const Post = require("../model/postModel");



// router.get("/", async (req, res) => {
//     const { page, limit, minComments, maxComments, device1, device2 } = req.query;
//     const userId = req.body;
//     if (userId) {
//         query.userId = userId
//     }
//     if (minComments && maxComments) {
//         query.no_of_comments = {
//             $and: [
//                 { no_of_comments: { $gt: minComments } },
//                 { no_of_comments: { $gt: maxComments } },
//             ]
//         }
//     }
//     if (device1 && device2) {
//         query.device = { $and: [{ device: device1 }, { device: device2 }] }
//     } else if (device1) {
//         query.device = device1
//     } else if (device2) {
//         query.device = device2
//     }

//     try {
//         const posts = await Post.find(query).sort({ no_of_comments }).skip((page - 1) * 17).limit(10).limit(limit)
//         res.status(200).json({ msg: "User Posts", posts });
//     } catch (error) {
//         res.status(400).json({ msg: "Internal server error" });
//     }
// })

// router.get("/top", middleware, async (req, res) => {
//     const { pageNo } = req.query
//     const limit = 3
//     try {
//         const topPosts = await Post.find(query).sort({ no_of_comments: -1 }).skip((page - 1) * 17).limit(10).limit(limit)
//         res.status(200).json({ msg: "User Posts", topPosts });
//     } catch (error) {
//         res.status(400).json({ msg: "Internal server error" });
//     }
// })






router.post("/add", middleware, async (req, res) => {
    try {
        const posts = await Post.create({ ...req.body, creator: req.userId, name: req.name })
        await posts.populate("creator")
        res.status(200).json({ msg: "Post added Successfully", post: posts });
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" });
    }
})

router.get("/", middleware, async (req, res) => {
    try {
        const { searchQuery } = req.query
        if (searchQuery) {
            const title = new RegExp(searchQuery, "i")
            // const posts = await Post.find({ title })
            const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] })
            res.status(200).json({ post: posts });
        } else {
            const posts = await Post.find({});
            res.status(200).json({ post: posts });
        }
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" });
    }
})



router.patch("/update/:postId", middleware, async (req, res) => {
    const postId = req.params.postId
    try {
        const posts = await Post.findById(postId)
        if (posts.creator.toString() !== req.userId) {
            res.status(400).json({ msg: "User cannot update the post" });
        }
        const updatePost = await Post.findByIdAndUpdate(postId, { ...req.body }, { new: true })
        if(!updatePost){
            res.status(400).json({ msg: "Post not found" });
        }
        res.status(200).json({ msg: "Post updated Successfully", updatedPost: updatePost });
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" });
    }
})

router.delete("/delete/:postId", middleware, async (req, res) => {
    const postId = req.params.postId
    try {
        const posts = await Post.findById(postId)
        if (posts.creator.toString() !== req.userId) {
            res.status(400).json({ msg: "User cannot delete the post" });
        }
        const deletePost = await Post.findByIdAndDelete(postId)
        if(!deletePost){
            res.status(400).json({ msg: "Post not found" });
        }
        res.status(200).json({ msg: "Post deleted Successfully" });
    } catch (error) {
        res.status(400).json({ msg: "Internal server error" });
    }
})

module.exports = router