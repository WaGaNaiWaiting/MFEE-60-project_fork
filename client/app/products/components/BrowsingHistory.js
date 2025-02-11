import React from "react";
import Image from "next/image";

export default function BrowsingHistory({ historyItems }) {
  return (
    <div className="mt-5">
      <h3 className="text-center mb-4">瀏覽記錄</h3>
      <div className="position-relative">
        {/* 左箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute start-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-left fa-2x text-secondary"></i>
        </div>

        {/* 商品清單區塊 */}
        <div className="products-slider">
          <div className="products-track">
            {historyItems.map((item, index) => (
              <div key={index} className="product-slide">
                <div className="product-img mb-2 position-relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <div className="text-truncate">{item.name}</div>
                  <div className="text-danger">NT${item.price}</div>
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
