import React from "react";
import Image from "next/image";

export default function RecommendedProducts({ products }) {
  return (
    <div className="mt-5">
      <h3 className="text-center mb-4">你可能會喜歡</h3>
      <div className="position-relative">
        {/* 左箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute start-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-left fa-2x text-secondary"></i>
        </div>

        {/* 商品清單區塊 */}
        <div className="products-slider">
          <div className="products-track">
            {products.map((product, index) => (
              <div key={index} className="product-slide">
                <div className="product-img mb-2 position-relative">
                  <Image
                    src={product.imgSrc}
                    alt={product.name}
                    width={200}
                    height={200}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <div className="button-group">
                    <button className="like-button">
                      <i className="fa-heart fa-solid text-danger"></i>
                    </button>
                    <button className="cart-button">
                      <i className="fa-solid fa-cart-shopping text-primary"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="fw-bold text-truncate">{product.name}</div>
                  <div className="text-muted text-truncate">
                    {product.description}
                  </div>
                  <div className="text-danger fw-bold">{product.salePrice}</div>
                  <div className="text-decoration-line-through text-secondary">
                    {product.originalPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute end-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-right fa-2x text-secondary"></i>
        </div>
      </div>
    </div>
  );
}
