// routes/products/index.js
import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

// 取得所有產品（支援分頁與排序）
router.get("/", async (req, res) => {
  try {
    // 解析查詢參數，確保是數字
    // ||設定預設值
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    //計算跳過的數量
    const offset = (page - 1) * limit;
    const sort = parseInt(req.query.sort) || 1;

    // 排序方式
    let orderBy = "p.created_at DESC";
    if (sort === 2) orderBy = "p.created_at ASC";
    else if (sort === 3) orderBy = "p.price ASC";
    else if (sort === 4) orderBy = "p.price DESC";

    console.log("🚀 DEBUG: limit =", limit, "offset =", offset);

    // 取得產品總數
    const [[{ totalCount }]] = await pool.execute(`
      SELECT COUNT(*) AS totalCount FROM product p WHERE p.isDeleted = 0
    `);
    /*
     [
        [{ totalCount: 150 }], // result[0] → 這是 SQL 回傳的結果，**是一個陣列**
        [SQL metadata]         // result[1] → MySQL2 內部資料，不會用到
      ]  
    */
    //@BUG為何不能使用注入??
    // **使用 `execute()`，確保 `LIMIT` 和 `OFFSET` 為數字**
    const sql = `
  SELECT 
    p.*, 
    p.name, 
    b.name AS brand_name, 
    -- 取得主圖（如果沒有主圖，就選擇第一張）
    (SELECT pi.imgUrl 
     FROM product_image pi 
     WHERE pi.product_id = p.id AND pi.isDeleted = 0 
     ORDER BY pi.isMain DESC, pi.id ASC LIMIT 1) AS main_image,
    -- 取得其他圖片（排除主圖）
    JSON_ARRAYAGG(
        CASE 
            WHEN pi.isMain = 0 THEN pi.imgUrl
            ELSE NULL
        END
    ) AS other_images
FROM product p
LEFT JOIN brand b ON p.id = b.id
LEFT JOIN product_image pi ON p.id = pi.product_id AND pi.isDeleted = 0
WHERE p.isDeleted = 0
GROUP BY p.id, b.id
ORDER BY ${orderBy}
LIMIT ${Number(limit)} OFFSET ${Number(offset)};

`;

    console.log(sql);

    const [rows] = await pool.execute(sql);

    // 計算總頁數
    const totalPages = Math.ceil(totalCount / limit);

    // 回應前端
    res.json({
      status: "success",
      data: rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("❌ 資料庫查詢錯誤：", error);
    res.status(500).json({
      status: "error",
      message: "資料庫查詢錯誤",
      error: error.message,
    });
  }
});

export default router;
