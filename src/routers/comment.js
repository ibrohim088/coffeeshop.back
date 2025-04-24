import { isLoggedIn } from "../auth/isLoggedIn.js"
import express from 'express'
import Comment from "../schema/Comment.js"
const router = express.Router();


// router.get('/comments')

router.get('/comments/:productId', async (req, res) => {
    try {
        const { productId } = req.params || {}
        console.log(productId);
        const data = await Comment.find({  productId}).populate('userId')
        res.status(200).json(data)
    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.post('/comments', isLoggedIn, async (req, res) => {
    try {
        console.log(req.user);
        const { id } = req.user || {}
        console.log({userId: id  , ...req.body});
        const comment = new Comment({userId: id  , ...req.body})
        await comment.save()
        res.status(201).json(comment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});




export default router