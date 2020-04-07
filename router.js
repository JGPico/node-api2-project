const express = require("express");

const Posts = require("./data/db.js");

const router = express.Router();

router.post("/", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({error: "Please provide title and content for post"});
    } else {
        Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log("Post error ", err);
            res.status(500).json({error: "Error adding post"});
        });
    }
});

router.post("/:id/comments", (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length >= 1) {
            Posts.insertComment(req.body)
            .then(comment => {
                Posts.findCommentById(req.params.id)
                .then(newC => {
                    res.status(201).json(newC);
                })
                .catch(err => {
                    res.status(500).json({error: "Error finding comment"});
                })
            })
            .catch(err => {
                res.status(500).json({error: "Server error posting new comment"});
            });
        } else {
            res.status(404).json({error: "No post with that id was found"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "Server error of epic proportions"});
    });
});

router.get("/", (req, res) => {
    Posts.find()
    .then(postArray => {
        res.status(200).json(postArray);
    })
    .catch(err => {
        res.status(500).json({error: "Error getting all posts"});
    })
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length >= 1) {
            res.status(200).json(post);
        } else {
            res.status(404).json({error: "No post with that id was found"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "Error retrieving post"});
    })
});

router.get("/:id/comments", (req, res) => {
    Posts.findCommentById(req.params.id)
    .then(comment => {
        if (comment.length >= 1) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({error: "No comment with that id was found"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "Error retrieving comment"});
    })
});

router.delete("/:id", (req, res) => {
    
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length >= 1) {
            let tempPost = post;
            Posts.remove(req.params.id)
            .then(rem => {
                res.status(200).json(tempPost);
            })
            .catch(err => {
                res.status(500).json({error: "Error deleting post"});
            })
        } else {
            res.status(404).json({error: "No post with that id was found"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "Error retrieving post"});
    });

});

router.put("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {

        if (post.length >= 1) {
            if (!req.body.title || !req.body.contents) {
                res.status(400).json({error: "Provide title and contents for post"})
            } else {
                Posts.update(req.params.id, req.body)
                .then(upd => {
                    Posts.findById(req.params.id)
                    .then(newP => {
                        res.status(200).json(newP);
                    })
                    .catch(err => {
                        res.status(500).json({error: "Uh oh."});
                    });
                })
                .catch(err => {
                    res.status(500).json({error: "Error find what should already exist, crap"});
                });
            }
             
        } else {
            res.status(404).json({error: "No post with that id was found"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "Error retrieving post"});
    });
});

module.exports = router;