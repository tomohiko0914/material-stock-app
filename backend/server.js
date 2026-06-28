// SQLite(DB)を読み込む
const db = require("./db");

// ==========================================
// Expressを読み込む
// ==========================================

const express = require("express");
const cors = require("cors");

// ==========================================
// Expressアプリを作成
// ==========================================
const app = express();

// CORSを有効にする
app.use(cors());

// JSONを受け取れるようにする
app.use(express.json());

// ==========================================
// ポート番号
// ==========================================

// サーバーを起動する番号
const PORT = 3000;

// ==========================================
// 材料一覧取得API
// ==========================================
app.get("/", (req, res) => {
  db.all("SELECT * FROM materials", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

// ==========================================
// 材料登録API
// ==========================================
app.post("/materials", (req, res) => {
  // フロントから送られてきたデータ
  const { material, height, width, stock, storageLocation } = req.body;

  // SQLiteへ保存
  db.run(
    `
        INSERT INTO materials
        (
            material,
            height,
            width,
            stock,
            storageLocation
        )
        VALUES (?, ?, ?, ?, ?)
        `,
    [material, height, width, stock, storageLocation],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "登録成功",
        id: this.lastID,
      });
    },
  );
});

// ==========================================
// 材料更新API
// ==========================================
app.put("/materials/:id", (req, res) => {
  const id = req.params.id;

  const { material, height, width, stock, storageLocation } = req.body;

  db.run(
    `
        UPDATE materials
        SET
            material = ?,
            height = ?,
            width = ?,
            stock = ?,
            storageLocation = ?
        WHERE id = ?
        `,
    [material, height, width, stock, storageLocation, id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "更新しました",
      });
    },
  );
});

// ==========================================
// 材料削除API
// ==========================================
app.delete("/materials/:id", (req, res) => {
  // URLのidを取得
  const id = req.params.id;

  // SQLiteから削除
  db.run("DELETE FROM materials WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    // 削除成功
    res.json({
      message: "削除しました",
    });
  });
});

// ==========================================
// 材料一覧取得API
// ==========================================
app.get("/materials", (req, res) => {
  db.all("SELECT * FROM materials ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

// ==========================================
// サーバー起動
// ==========================================

app.listen(PORT, () => {
  console.log(`サーバー起動：http://localhost:${PORT}`);
});
