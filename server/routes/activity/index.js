import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req,res)=>{
    const sql = "SELECT * FROM `activity`";
    const [rows] = await pool.execute(sql);
    res.status(200).json({
        status: "success",
        data: rows,
        message: "取得資料成功",
    });
    
})

export default router;
