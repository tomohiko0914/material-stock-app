const db = require("./db");

const materials = [
    {
        material: "アクリル 透明",
        height: 910,
        width: 1820,
        stock: 20,
        storageLocation: "防湿庫"
    },
    {
        material: "塩ビ板",
        height: 1000,
        width: 2000,
        stock: 12,
        storageLocation: "第二工場"
    },
    {
        material: "アルミ板",
        height: 500,
        width: 1000,
        stock: 8,
        storageLocation: "物流倉庫"
    }
 
];

materials.forEach((item) => {

    db.run(
        `
        INSERT INTO materials
        (material,height,width,stock,storageLocation)
        VALUES(?,?,?,?,?)
        `,
        [
            item.material,
            item.height,
            item.width,
            item.stock,
            item.storageLocation
        ]
    );

});

console.log("ダミーデータ登録完了");

db.close();