import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "../server/app/page.js";

async function init() {
  const app = express();
  const port = 5000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/posts", postRouter);

  app.get("/", (req, res) => {
    res.send("Hello Nannie!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}
init();

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const result = await pool.query(`select* from posts where post_id=$1`, [
    postId,
  ]);

  return res.json({
    data: result.rows,
  });
});