import { useState, useEffect } from "react";
import axios from "axios";

export default function useFavorite(productId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3005/api/favorites";

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL);

        // 從後端獲取收藏清單，檢查是否包含這個 productId
        const favorites = response.data.favorites.map((fav) => fav.product_id);
        setIsFavorite(favorites.includes(productId));
      } catch (err) {
        console.error("獲取收藏狀態失敗:", err);
        setError("無法獲取收藏狀態");
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [productId]);

  const toggleFavorite = async () => {
    try {
      setLoading(true);

      if (isFavorite) {
        // 從後端刪除收藏
        await axios.delete(`${API_BASE_URL}/${productId}`);
      } else {
        // 送出 PUT 請求，加入收藏
        await axios.put(`${API_BASE_URL}/${productId}`);
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("收藏操作失敗:", err);
      setError("收藏操作失敗");
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    loading,
    error,
  };
}
