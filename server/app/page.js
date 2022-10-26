import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const status = req.query.category || "";
  const keywords = req.query.keywords || "";
  const page = req.query.page || 1;

  const PAGE_SIZE = 10;
  const offset = (page - 1) * PAGE_SIZE;

  let query = "";
  let values = [];

  if (status && keywords) {
    query = `select * from posts
    where status=$1
    and title ilike $2
    limit $3
    offset $4`;
    values = [status, keywords, PAGE_SIZE, offset];
  } else if (keywords) {
    query = `select * from posts
    where title ilike $1
    limit $2
    offset $3`;
    values = [keywords, PAGE_SIZE, offset];
  } else if (status) {
    query = `select * from posts
    where status=$1
    limit $2
    offset $3`;
    values = [status, PAGE_SIZE, offset];
  } else {
    query = `select * from posts
    limit $1
    offset $2`;
    values = [PAGE_SIZE, offset];
  }

  const results = await pool.query(query, values);

  return res.json({
    data: results.rows,
  });
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const result = await pool.query(`select* from posts where post_id=$1`, [
    postId,
  ]);

  return res.json({
    data: result.rows,
  });
});

postRouter.post("/", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await pool.query(
    `insert into posts(post_id,user_id,title,content,attach_id,category_id,created_at,updated_at)
    values($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      newPost.post_id,
      newPost.user_id,
      newPost.title,
      newPost.content,
      newPost.attach_id,
      newPost.category_id,
      newPost.created_at,
      newPost.updated_at,
    ]
  );

  return res.json({
    message: "you has been posted sucessfully",
  });
});

// postRouter.post("/", async (req, res) => {
//   const newPost = req.body;

//   await pool.query(
//     `insert into posts(comment_id,content,attach_id,post_id)
//     values($1, $2, $3, $4)`,
//     [newPost.comment_id, newPost.content, newPost.attach_id, newPost.post_id]
//   );

//   return res.json({
//     message: "you has been created comment sucessfully",
//   });
// });

export default postRouter;
