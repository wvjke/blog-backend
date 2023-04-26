import PostModel from "../models/Post.js";
import fs from "fs";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get all posts",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } }
    )
      .populate("user")
      .populate("comments.user");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts.map((obj) => obj.tags.flat());


    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get tags",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("comments.user").exec();

    const comments = posts.map((obj) => obj.comments.flat());

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get comments",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const { imageUrl } = await PostModel.findById(postId).exec();

    if (imageUrl) {
      fs.unlink(`./${imageUrl.slice(21)}`, (err) => {
        if (err) {
          if (err.code === "ENOENT") return;
          throw err;
        }
      });
    }

    const post = await PostModel.deleteOne({ _id: postId });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({ succes: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
      comments: [],
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.body.id;

    await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            text: req.body.text,
            created: Date.now(),
            user: req.userId,
          },
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.body.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};

export const getPostByCommentId = async (req, res) => {
  try {
    const commentId = req.body.id;

    const post = await PostModel.find({
      comments: { $elemMatch: { _id: commentId } },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get post",
    });
  }
};
