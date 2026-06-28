// ==========================================
// APIのURL
// ローカルとRenderを自動で切り替える
// ==========================================
const API_URL =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://material-stock-app.onrender.com";

// ==========================================
// 材料データを保存する配列
// ==========================================

// 配列とは複数のデータを保存できる箱
let materials = [];

// 編集中のID
let editingId = null;

// ==========================================
// 登録ボタンを取得
// ==========================================

// HTMLのid="addBtn"を取得
const addBtn = document.getElementById("addBtn");

// ==========================================
// 登録ボタンが押されたら
// addMaterial()を実行する
// ==========================================
addBtn.addEventListener("click", addMaterial);

// ==========================================
// 材料を登録する関数
// ==========================================

function addMaterial() {
  // --------------------------------------
  // 入力欄の値を取得する
  // --------------------------------------

  // 材料名を取得
  const material = document.getElementById("material").value;

  // 高さ(H)を取得
  // Number()で文字列から数値へ変換
  const height = Number(document.getElementById("height").value);

  // 幅(W)を取得
  const width = Number(document.getElementById("width").value);

  // 在庫数を取得
  const stock = Number(document.getElementById("stock").value);

  // 保管場所を取得
  const storageLocation = document.getElementById("storageLocation").value;

  // ------------------------------
  // 入力チェック
  // ------------------------------
  if (material === "") {
    alert("材料名を入力してください。");
    return;
  }

  if (height <= 0) {
    alert("高さを入力してください。");
    return;
  }

  if (width <= 0) {
    alert("幅を入力してください。");
    return;
  }

  if (stock < 0) {
    alert("在庫数を入力してください。");
    return;
  }

  if (storageLocation === "") {
    alert("保管場所を入力してください。");
    return;
  }

  if (editingId !== null) {
    updateMaterial();
    return;
  }

  fetch(`${API_URL}/materials`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      material,
      height,
      width,
      stock,
      storageLocation,
    }),
  })
    .then((response) => response.json())

    .then((data) => {
      alert(data.message);

      // ------------------------------
      // 検索欄を空にする
      // ------------------------------
      document.getElementById("searchInput").value = "";

      // ------------------------------
      // 入力欄を空にする
      // ------------------------------
      document.getElementById("material").value = "";
      document.getElementById("height").value = "";
      document.getElementById("width").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("storageLocation").value = "";

      // 最新データをSQLiteから取得
      loadMaterials();
    })
    .catch((error) => {
      console.error(error);
      alert("登録に失敗しました。");
    });
}

// ==========================================
// 材料一覧を画面へ表示する関数
// ==========================================
function displayMaterials() {
  console.log("displayMaterialsが呼ばれました");
  console.log(materials);

  // --------------------------------------
  // 検索文字を取得
  // --------------------------------------
  const keyword = searchInput.value.toLowerCase();

  // HTMLの一覧エリアを取得
  const list = document.getElementById("inventoryList");

  // --------------------------------------
  // 一度中身を空にする
  // （毎回表示を作り直すため）
  // --------------------------------------
  list.innerHTML = "";

  // --------------------------------------
  // 配列を1件ずつ取り出す
  // --------------------------------------
  materials.forEach(function (item) {
    console.log(item);

    // --------------------------------------
    // サイズ(H×W)を文字列にする
    // --------------------------------------
    const size = `${item.height}×${item.width}`;

    // --------------------------------------
    // 材料名・保管場所・サイズで検索
    // --------------------------------------
    if (
      !item.material.toLowerCase().includes(keyword) &&
      !item.storageLocation.toLowerCase().includes(keyword) &&
      !size.includes(keyword)
    ) {
      return;
    }

    // ----------------------------------
    // HTMLを追加する
    // ----------------------------------
    list.innerHTML += `

        <div class="card">

            <h3>${item.material}
            </h3>

           <ul class="material-info">
            <li>
             <span>サイズ</span>
            <strong>${item.height} × ${item.width}</strong>
            </li>
            <li>
                <span>在庫</span>
                <strong>${item.stock}</strong>
            </li>
            <li>
                <span>保管場所</span>
                <strong>${item.storageLocation}</strong>
           </li>
        </ul>

            

        </div> 

        <button class="edit-btn"
        onclick="editMaterial(${item.id})">

            ✏ 編集

        </button>

        
        <button class="delete-btn"
                onclick="deleteMaterial(${item.id})">

            🗑 削除

        </button>

    </div>

        `;
  });
}


// ==========================================
// 材料を削除する関数
// ==========================================
function deleteMaterial(id) {
  // --------------------------------------
  // 本当に削除するか確認
  // --------------------------------------
  const result = confirm("この材料を削除しますか？");

  // キャンセルなら何もしない
  if (!result) {
    return;
  }

  fetch(`${API_URL}/materials/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);

      loadMaterials();
    });
}

// ==========================================
// 検索欄
// ==========================================
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  displayMaterials();
});

// ==========================================
// dbから読み込む関数
// ==========================================
function loadMaterials() {
  fetch(`${API_URL}/materials`)
    .then((response) => response.json())

    .then((data) => {
      materials = data;

      displayMaterials();
    });
}

// ==========================================
// アプリ起動時にデータを読み込む
// ==========================================
loadMaterials();

// ==========================================
// 編集機能
// ==========================================
function editMaterial(id) {
  // 編集する材料を探す
  const item = materials.find((material) => material.id == id);

  if (!item) {
    alert("編集対象のデータが見つかりません");
    return;
  }

  // 入力欄へ表示
  document.getElementById("material").value = item.material;
  document.getElementById("height").value = item.height;
  document.getElementById("width").value = item.width;
  document.getElementById("stock").value = item.stock;
  document.getElementById("storageLocation").value = item.storageLocation;

  // 編集中IDを保存
  editingId = id;

  // ボタン名変更
  document.getElementById("addBtn").textContent = "更新";

  // フォームの位置まで自動でスクロール
  document.querySelector(".form-area").scrollIntoView({
    behavior: "smooth",
  });
}

function updateMaterial() {
  const material = document.getElementById("material").value;
  const height = Number(document.getElementById("height").value);
  const width = Number(document.getElementById("width").value);
  const stock = Number(document.getElementById("stock").value);
  const storageLocation = document.getElementById("storageLocation").value;

  fetch(`${API_URL}/materials/${editingId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      material,
      height,
      width,
      stock,
      storageLocation,
    }),
  })
    .then((res) => res.json())

    .then((data) => {
      alert(data.message);

      editingId = null;

      document.getElementById("addBtn").textContent = "登録";

      loadMaterials();

      document.getElementById("material").value = "";
      document.getElementById("height").value = "";
      document.getElementById("width").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("storageLocation").value = "";

      document.getElementById("searchInput").value = "";
    });
}
