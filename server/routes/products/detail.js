// routes/products/detail.js
import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 取得單一產品詳細資訊
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // 1️⃣ 查詢商品基本資訊
    const [productRows] = await pool.execute(
      `
      SELECT 
        p.*, 
        b.name AS brand_name, 
        b.description AS brand_description
      FROM product p
      LEFT JOIN product_specification ps ON p.id = ps.product_id AND ps.isDeleted = 0
      LEFT JOIN brand b ON ps.brand_id = b.id
      WHERE p.id = ? AND p.isDeleted = 0
    `,
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ status: "error", message: "找不到該商品" });
    }

    const product = productRows[0];

    // 2️⃣ 預設值（防止某些欄位為 `null`）
    const defaultProduct = {
      brand_name: "TRYGONS",
      name: product.name || "液態面鏡",
      price: product.price || 1999,
      original_price: product.original_price || 2500,

      // 商品描述
      description:
        product.description || "能保有正常水下視野，並省去面鏡平壓的空氣消耗。",
      detailed_description:
        product.detailed_description ||
        "不想多費空氣做面鏡平壓，又希望在水中保有視力，液態面鏡專為自潛玩家而生。",
      brand_description:
        product.brand_description ||
        "TRYGONS 是專業的自由潛水裝備品牌，專注於開發創新的水下運動裝備",

      // 商品規格
      images: [
        "/images/1.webp",
        "/images/1.webp",
        "/images/1.webp",
        "/images/1.webp",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "黑色", code: "#000000" },
        { name: "灰色", code: "#808080" },
      ],

      // 評價相關
      rating: 4.5,
      review_count: 245,

      // 其他資訊
      stock: product.stock || 100,
      isDeleted: 0,
    };

    // 一起查詢會發生重複
    // 3️⃣ 查詢不重複的 `colors`
    const [colorRows] = await pool.execute(
      `
      SELECT DISTINCT 
        c.id AS color_id, c.name AS color_name, c.code AS color_code
      FROM product_variant pv
      LEFT JOIN color c ON pv.color_id = c.id
      WHERE pv.product_id = ?
    `,
      [productId]
    );

    // 4️⃣ 查詢不重複的 `sizes`
    const [sizeRows] = await pool.execute(
      `
      SELECT DISTINCT 
        s.id AS size_id, s.name AS size_name
      FROM product_variant pv
      LEFT JOIN size s ON pv.size_id = s.id
      WHERE pv.product_id = ?
    `,
      [productId]
    );

    // 5️⃣ 整理 `colors` & `sizes`
    const colors = colorRows.map((color) => ({
      id: color.color_id,
      name: color.color_name,
      code: color.color_code,
    }));

    const sizes = sizeRows.map((size) => size.size_name);

    // 測試用 勿看
    // 6️⃣ 合併 `defaultProduct` + `product` + `查詢到的 colors & sizes`
    const finalProduct = {
      ...defaultProduct,
      ...product,
      brand_name: product.brand_name || defaultProduct.brand_name,
      description: product.description || defaultProduct.description,
      detailed_description:
        product.detailed_description || defaultProduct.detailed_description,
      images: defaultProduct.images, // 暫時都使用預設圖片
      colors: colors.length > 0 ? colors : defaultProduct.colors, // 如果沒有從 DB 取得顏色，才使用預設值
      sizes: sizes.length > 0 ? sizes : defaultProduct.sizes, // 同上
    };

    // 7️⃣ 回傳前端
    res.json({
      status: "success",
      data: finalProduct,
    });
  } catch (error) {
    console.error("❌ 資料庫查詢錯誤：", error);
    res.status(500).json({ status: "error", message: "資料庫查詢錯誤" });
  }
});

export default router;
