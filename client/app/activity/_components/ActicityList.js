"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import styles from "./products.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

// API 基礎 URL
const API_BASE_URL = "http://localhost:3005/api";

export default function ProductList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState({
        text: "排序",
        value: 1,
    });
    const [showClassification, setShowClassification] = useState(false);
    const [selectedDisplay, setSelectedDisplay] = useState("每頁顯示24件");
    const [showBrandClassification, setShowBrandClassification] =
        useState(false);

    // 撈取資料
    const [products, setProducts] = useState([]);
    // 分頁
    //parseInt 把字串轉成數字    || 負責設定預設值
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [limit, setLimit] = useState(
        parseInt(searchParams.get("limit")) || 24
    );
    const [totalPages, setTotalPages] = useState(1);
    // 可以放動畫 先不動
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 處理 URL 更新
    const updateURL = (newPage, newLimit) => {
        const params = new URLSearchParams();
        params.set("page", newPage.toString());
        params.set("limit", newLimit.toString());
        router.push(`/products?${params.toString()}`);
    };

    // 獲取產品資料
    // FIXME: - 有依賴問題
    useEffect(() => {
        fetchProducts(page, limit, selectedSort.value); // 讓 API 依照當前排序方式請求
    }, [page, limit, selectedSort.value]); // 監聽 selectedSort.value

    // 獲取所有產品
    const fetchProducts = async (currentPage, itemsPerPage, sortValue) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/products?page=${currentPage}&limit=${itemsPerPage}&sort=${sortValue}`
            );
            console.log("API Response:", response.data);
            if (response.data.status === "success") {
                setProducts(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setPage(response.data.pagination.currentPage);
                updateURL(response.data.pagination.currentPage, itemsPerPage);
                console.log("API Response:", response.data.data);
            } else {
                setError("獲取產品資料失敗");
            }
        } catch (error) {
            console.error("Error fetching products:", error.response || error);
            setError("獲取產品資料時發生錯誤");
        } finally {
            setLoading(false);
        }
    };

    // 每頁顯示按鈕
    const handleDisplayChange = (newLimit, displayText) => {
        setSelectedDisplay(displayText);
        setLimit(newLimit);
        setPage(1); // 切換顯示數量時重置為第一頁
        setShowDisplayDropdown(false); //關閉下拉選單
    };

    // 處理排序
    const handleSort = async (text, value) => {
        setSelectedSort({ text, value });
        setShowDropdown(false); //關閉下拉選單

        const sortedProducts = [...products];
        switch (value) {
            case 1: // 綜合
                sortedProducts.sort((a, b) => a.id - b.id);
                break;
            case 2: // 最新上架
                sortedProducts.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                break;
            case 3: // 價格：由低到高
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 4: // 價格：由高到低
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        fetchProducts(page, limit, value);
    };

    // 處理品牌篩選
    const handleBrandFilter = async (brandName) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/products/brand/${brandName}`
            );
            if (response.data.status === "success") {
                setProducts(response.data.data);
            } else {
                setError("獲取品牌產品失敗");
            }
        } catch (error) {
            console.error("Error fetching products by brand:", error);
            setError("獲取品牌產品時發生錯誤");
        } finally {
            setLoading(false);
        }
    };

    // 處理分類篩選
    const handleCategoryFilter = async (categoryName) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/products/category/${categoryName}`
            );
            if (response.data.status === "success") {
                setProducts(response.data.data);
            } else {
                setError("獲取分類產品失敗");
            }
        } catch (error) {
            console.error("Error fetching products by category:", error);
            setError("獲取分類產品時發生錯誤");
        } finally {
            setLoading(false);
        }
    };

    // 處理點擊外部關閉下拉選單
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown")) {
                setShowDropdown(false);
                setShowDisplayDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // if (loading) return <div className="text-center py-4">載入中...</div>;
    // if (error) return <div className="text-center py-4 text-danger">{error}</div>;

    return (
        <div className="container py-4">
            <div className="row">
                {/* 左側邊欄 */}
                <div className="col-lg-3 col-md-4">
                    <div className="d-grid ">
                        {/* 產品分類 */}
                        <div
                            className={`${styles.productClassification} ${
                                styles.sideCard
                            } ${showClassification ? styles.open : ""}`}>
                            <div
                                className={styles.cardTitle}
                                onClick={() =>
                                    setShowClassification(!showClassification)
                                }>
                                <h5>產品分類</h5>
                                <i className="bi bi-chevron-down"></i>
                            </div>
                            <ul className={styles.classificationMenu}>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("面鏡");
                                        }}>
                                        面鏡 / 呼吸管
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "自由潛水面鏡"
                                                    );
                                                }}>
                                                自由潛水面鏡
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "休閒潛水面鏡"
                                                    );
                                                }}>
                                                休閒潛水面鏡
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "度數鏡片面鏡"
                                                    );
                                                }}>
                                                度數鏡片面鏡
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "呼吸管"
                                                    );
                                                }}>
                                                呼吸管
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "防霧劑 / 清潔劑"
                                                    );
                                                }}>
                                                防霧劑 / 清潔劑
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "面鏡帶 / 面鏡盒 / 扣具"
                                                    );
                                                }}>
                                                面鏡帶 / 面鏡盒 / 扣具
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("蛙鞋");
                                        }}>
                                        蛙鞋
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "開放式蛙鞋"
                                                    );
                                                }}>
                                                開放式蛙鞋
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryFilter(
                                                        "全包式蛙鞋"
                                                    );
                                                }}>
                                                全包式蛙鞋
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className={styles.categoryItem}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("潛水配件");
                                        }}>
                                        潛水配件
                                    </a>
                                </li>
                                <li className={styles.categoryItem}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("防寒衣物");
                                        }}>
                                        防寒衣物
                                    </a>
                                </li>
                                <li className={styles.categoryItem}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("包包攜行");
                                        }}>
                                        包包攜行
                                    </a>
                                </li>
                                <li className={styles.categoryItem}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryFilter("生活小物");
                                        }}>
                                        生活小物
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 品牌名稱 */}
                        <div
                            className={`${styles.productClassification} ${
                                styles.sideCard
                            } ${showBrandClassification ? styles.open : ""}`}>
                            <div
                                className={styles.cardTitle}
                                onClick={() =>
                                    setShowBrandClassification(
                                        !showBrandClassification
                                    )
                                }>
                                <h5>品牌名稱</h5>
                                <i className="bi bi-chevron-down"></i>
                            </div>
                            <ul className={styles.classificationMenu}>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#" className={styles.categoryLink}>
                                        A
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleBrandFilter(
                                                        "Aqua Lung"
                                                    );
                                                }}>
                                                Aqua Lung
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleBrandFilter("Atomic");
                                                }}>
                                                Atomic
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">B、C、D</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Beuchat")
                                                }>
                                                Beuchat
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Cressi")
                                                }>
                                                Cressi
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("DiveR")
                                                }>
                                                DiveR
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">E、F、G、H、I</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter(
                                                        "Fourth Element"
                                                    )
                                                }>
                                                Fourth Element
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Hollis")
                                                }>
                                                Hollis
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">L、M、N</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Mares")
                                                }>
                                                Mares
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">O、P、R</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("OMER")
                                                }>
                                                OMER
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Problue")
                                                }>
                                                Problue
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">S</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter(
                                                        "Scubapro"
                                                    )
                                                }>
                                                Scubapro
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Seac")
                                                }>
                                                Seac
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">T、V、W</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("Tusa")
                                                }>
                                                Tusa
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a href="#">0-9、其他</a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter("2XU")
                                                }>
                                                2XU
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    handleBrandFilter(
                                                        "其他品牌"
                                                    )
                                                }>
                                                其他品牌
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <button className="btn btn-primary w-100 mb-3">
                            套用篩選(0/20)
                        </button>

                        {/* 商品篩選 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>商品篩選</h5>
                            </div>
                            <div className={styles.filterSection}>
                                <div className={styles.filterTitle}>
                                    價格區間
                                </div>
                                <div className={styles.priceInputs}>
                                    <input
                                        type="number"
                                        placeholder="最低"
                                        className={styles.priceInput}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        placeholder="最高"
                                        className={styles.priceInput}
                                    />
                                </div>

                                <div className={styles.filterTitle}>
                                    品牌類別
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-leaders"
                                        />
                                        <label htmlFor="brand-leaders">
                                            LEADERS (4)
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-omer"
                                        />
                                        <label htmlFor="brand-omer">
                                            OMER (15)
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.filterTitle}>
                                    顏色類別
                                </div>
                                <div className={styles.colorGroup}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className={styles.colorCircle}
                                            style={{
                                                backgroundColor: "#808080",
                                            }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 新品上市 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>新品上市</h5>
                            </div>
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={`new-${item}`}
                                    className={styles.sidebarProduct}>
                                    <div className={styles.sidebarProductImg}>
                                        <Image
                                            src="/images/1.webp"
                                            alt="新品商品"
                                            fill
                                            sizes="80px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.sidebarProductInfo}>
                                        <div
                                            className={
                                                styles.sidebarProductBrand
                                            }>
                                            品牌名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductTitle
                                            }>
                                            商品名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductPrice
                                            }>
                                            NT$0000
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 特惠商品 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>特惠商品</h5>
                            </div>
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={`special-${item}`}
                                    className={styles.sidebarProduct}>
                                    <div className={styles.sidebarProductImg}>
                                        <Image
                                            src="/images/1.webp"
                                            alt="特惠商品"
                                            fill
                                            sizes="80px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.sidebarProductInfo}>
                                        <div
                                            className={
                                                styles.sidebarProductBrand
                                            }>
                                            品牌名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductTitle
                                            }>
                                            商品名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductPrice
                                            }>
                                            NT$0000
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右側主要內容區 */}
                <div className="col-lg-9 col-md-8">
                    {/* 商品介紹 */}
                    <div className="mb-4">
                        <h3 className="mb-3">潛入藍色世界，追逐自由與夢想</h3>
                        <p className="mb-2">
                            歡迎來到我們的課程與活動專區，這裡匯集了潛水愛好者不可錯過的精彩體驗！從基礎潛水課程到進階技術培訓，還有刺激有趣的深海探險活動，我們為您精心設計每一項內容，確保安全與專業性兼具。無論您是剛開始接觸潛水還是已有豐富經驗，這裡都有適合您的選擇。
                        </p>
                        <p>
                            現在購物，還可享受獨家優惠：單筆滿 $3000
                            現在報名，還可享受獨家優惠：單次報名滿 $3000
                            即贈精美潛水紀念品，部分課程更有限時折扣活動！立即瀏覽，輕鬆找到專屬於您的潛水體驗，為下一次海底旅程做好準備。學習新技能、探索深海奧秘，就從這裡開始！
                        </p>
                    </div>

                    {/* 輪播圖 */}
                    <div
                        className="position-relative mb-4"
                        style={{ height: "188px", overflow: "hidden" }}>
                        <Image
                            src="/image/product-top-slide.png"
                            alt="潛水裝備橫幅"
                            priority
                            fill
                            style={{ objectFit: "cover" }}
                        />
                        <div className="position-absolute top-50 end-0 translate-middle-y pe-5">
                            <div className="text-end">
                                <h3 className="text-white mb-4">
                                    專業裝備，
                                    <br />
                                    陪你深海冒險每一步！
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* 排序和顯示選項 */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                onClick={() =>
                                    setShowDisplayDropdown(!showDisplayDropdown)
                                }>
                                {selectedDisplay}
                            </button>
                            <ul
                                className={`dropdown-menu ${
                                    showDisplayDropdown ? "show" : ""
                                }`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                24,
                                                "每頁顯示24件"
                                            )
                                        }>
                                        每頁顯示24件
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                48,
                                                "每頁顯示48件"
                                            )
                                        }>
                                        每頁顯示48件
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                72,
                                                "每頁顯示72件"
                                            )
                                        }>
                                        每頁顯示72件
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                onClick={() => setShowDropdown(!showDropdown)}>
                                <i className="bi bi-sort-down-alt me-2"></i>
                                {selectedSort.text}
                            </button>
                            <ul
                                className={`dropdown-menu ${
                                    showDropdown ? "show" : ""
                                }`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleSort("綜合", 1)}>
                                        綜合
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("最新上架", 2)
                                        }>
                                        最新上架
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("價格：由低到高", 3)
                                        }>
                                        價格：由低到高
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("價格：由高到低", 4)
                                        }>
                                        價格：由高到低
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("商品評分最高", 5)
                                        }>
                                        商品評分最高
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 商品列表 */}
                    <div className="row g-4">
                        
                            <ProductCard key="1" product="1" />
                    </div>
                    {/* <div className="row g-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div> */}

                    {/* 分頁 */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div>
                            第{page}頁/共{totalPages}頁
                        </div>
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0">
                                {/* 上一頁按鈕 */}
                                <li
                                    className={`page-item ${
                                        page === 1 ? "disabled" : ""
                                    }`}>
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={page === 1}>
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>

                                {/* 動態生成頁碼按鈕 */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // 只顯示當前頁附近的頁碼
                                    if (
                                        pageNumber === 1 || // 第一頁
                                        pageNumber === totalPages || // 最後一頁
                                        (pageNumber >= page - 1 &&
                                            pageNumber <= page + 1) // 當前頁的前後一頁
                                    ) {
                                        return (
                                            <li
                                                key={pageNumber}
                                                className={`page-item ${
                                                    page === pageNumber
                                                        ? "active"
                                                        : ""
                                                }`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(pageNumber)
                                                    }>
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        );
                                    } else if (
                                        pageNumber === page - 2 ||
                                        pageNumber === page + 2
                                    ) {
                                        // 顯示省略號
                                        return (
                                            <li
                                                key={pageNumber}
                                                className="page-item disabled">
                                                <span className="page-link">
                                                    ...
                                                </span>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}

                                {/* 下一頁按鈕 */}
                                <li
                                    className={`page-item ${
                                        page === totalPages ? "disabled" : ""
                                    }`}>
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={page === totalPages}>
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
