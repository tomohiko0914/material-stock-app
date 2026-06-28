// ==========================================
// SQLiteを読み込む
// ==========================================

// sqlite3ライブラリを使用
const sqlite3 = require("sqlite3").verbose();

// ==========================================
// データベースへ接続
// ==========================================

// database.db が無ければ自動作成される
const db = new sqlite3.Database("database.db", (err) => {

    if (err) {

        console.error("DB接続失敗", err);

    } else {

        console.log("SQLiteへ接続しました");

    }

});

// ==========================================
// materialsテーブル作成
// ==========================================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS materials (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            material TEXT NOT NULL,

            height INTEGER,

            width INTEGER,

            stock INTEGER,

            storageLocation TEXT

        )
    `);

});

// ==========================================
// 他のファイルでも使えるようにする
// ==========================================

module.exports = db;