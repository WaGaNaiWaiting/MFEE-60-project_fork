import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 1. 取得我的最愛清單 (GET /api/favorites)
router.get("/", async (req, res) => {
  try {
    const userId = 1; //NOTE -  到時候從 user 資訊從 JWT 解析

    const [favorites] = await pool.execute(
      "SELECT product_id FROM favorites WHERE user_id = ?",
      [userId]
    );
    res.json({ favorites });
  } catch (error) {
    console.error("取得最愛清單錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

// 2. 加入我的最愛 (PUT /api/favorites/:productId)
router.put("/:productId", async (req, res) => {
  try {
    const userId = 1;
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "商品 ID 格式錯誤" });
    }

    console.log("Checking product existence:", productId);
    const [productCheck] = await pool.execute(
      "SELECT id FROM product WHERE id = ?",
      [productId]
    );
    if (productCheck.length === 0) {
      return res.status(404).json({ error: "商品不存在" });
    }

    console.log("Checking if already favorited:", userId, productId);
    const [exists] = await pool.execute(
      "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    if (exists.length > 0) {
      return res.status(400).json({ error: "該商品已收藏" });
    }

    console.log("Inserting favorite:", userId, productId);
    await pool.execute(
      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
      [userId, productId]
    );

    res.json({ message: "已加入最愛" });
  } catch (error) {
    console.error("加入最愛錯誤:", error.message);
    res.status(500).json({ error: "伺服器錯誤", details: error.message });
  }
});

// 3. 從我的最愛移除 (DELETE /api/favorites/:productId)
router.delete("/:productId", async (req, res) => {
  try {
    const userId = 1;
    const productId = req.params.productId;

    // 刪除最愛紀錄
    const [result] = await pool.execute(
      "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "該商品不在最愛清單中" });
    }

    res.json({ message: "已移除最愛" });
  } catch (error) {
    console.error("移除最愛錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

export default router;
