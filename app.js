const express = require("express");
const { createPool } = require("mysql");
const CryptoJS = require('crypto-js');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.locals.showErrror = () => {
  if (req.body.user_id == 1) {
    return `<div class="alert alert-warning" role="alert">
      Oops !!!!! You Can Not comment on your post.
    </div>`
  }

}


//connect with DB
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "task",
  connectionLimit: 10,
});

app.get("/", (req, res) => {

  // Use the connection
  pool.query(
    `SELECT u.username  ,p.post_id ,u.user_id ,p.post FROM users u INNER JOIN posts p ON u.user_id=p.user_id`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        return res.render("home", { result });
      }
    }
  );



});

app.post("/comments", (req, res) => {

  console.log("Request body is", req.body);
  // Decrypting data
  let decode_user_id = atob(req.body.user_id)
  let decode_post_id = atob(req.body.post_id)
  console.log(decode_user_id)

  if (decode_user_id == 1) {
    res.json({ message: "You can not comment on your post " })
  } else {

    pool.query(
      "INSERT INTO comments SET comment = ? , post_id = ?",
      [req.body.u_comment, decode_post_id],
      (error, results) => {
        // Handle error after the release.
        if (error) throw error;
        return res.redirect("/");


      }
    );

  }

}

);


app.listen(4000, () => {
  console.log("server listing..................");
});
