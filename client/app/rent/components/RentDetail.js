'use client' // 明確標記為 Client Component

import React, { useEffect } from 'react'
import Image from 'next/image'
import '../components/RentDetail.css'
import '../components/flatpickr.css'
import '../../../public/globals.css'

const ProductDetailUI = ({ product }) => {
  // 初始化日曆
  useEffect(() => {
    // 動態加載 flatpickr
    import('flatpickr').then((flatpickr) => {
      flatpickr.default('#fixed-calendar', {
        mode: 'range',
        dateFormat: 'Y年m月d日',
        minDate: 'today',
        inline: true,
        locale: {
          firstDayOfWeek: 1, // 星期一為第一天
          weekdays: {
            shorthand: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
            longhand: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
          },
          months: {
            shorthand: [
              'a1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ],
            longhand: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月',
            ],
          },
        },
        disableMobile: true,
        onChange: function (selectedDates, dateStr, instance) {
          const dateRangeText = document.querySelector('#date-range-text')
          const totalCostText = document.querySelector('#total-cost-text')
          const startDate = selectedDates[0]
          const endDate = selectedDates[1]

          if (startDate && endDate) {
            const formattedStartDate = instance.formatDate(
              startDate,
              'Y年m月d日'
            )
            const formattedEndDate = instance.formatDate(endDate, 'Y年m月d日')
            dateRangeText.textContent = `租賃 ${formattedStartDate} 至 ${formattedEndDate}`
            totalCostText.style.display = 'block'
          } else {
            dateRangeText.textContent = ''
            totalCostText.style.display = 'none'
          }
        },
        render: function (dates, dateStr, instance) {
          // 遍歷日期渲染並添加自訂類別
          const days = instance.daysContainer.querySelectorAll('.flatpickr-day')
          days.forEach((day) => {
            const date = day.dateObj
            // 檢查是否是本月日期
            if (date.getMonth() !== instance.currentMonth) {
              day.classList.add('flatpickr-other-month')
            } else {
              day.classList.remove('flatpickr-other-month')
            }
          })
        },
      })
    })
  }, [])

  return (
    <div className="container-fluid justify-content-center">
      <div className="row">
        {/* 麵包屑 */}
        <div className="col-12 col-md-9 mx-auto bread">
          <nav aria-label="breadcrumb">
            <ol className="m-0 breadcrumb breadcrumb-list">
              <li className="breadcrumb-item">
                <a className="a" href="#">
                  首頁
                </a>
              </li>
              <li className="breadcrumb-item">
                <a className="a" href="/site/rent">
                  租借商品列表
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                租借商品詳情
              </li>
            </ol>
          </nav>
        </div>
        {/* 網頁內容區塊 */}
        <div className="col-12 col-md-9 mx-auto">
          <div className="main-details d-flex flex-column flex-md-row justify-content-between align-items-start">
            {/* 圖片區域 */}
            <div className="px-3 col-12 col-md-6 col-lg-6 mx-auto d-flex flex-column">
              {/* 商品主圖 */}
              <div className="main-image">
                <Image
                  src={product.images[0]}
                  className="img-fluid"
                  alt="商品主圖"
                  width={360} // 設定圖片的寬度
                  height={360} // 設定圖片的高度
                  layout="responsive"
                  priority
                  unoptimized
                />
              </div>
              <div className="small-images d-flex flex-row justify-content-between align-items-center flex-wrap">
                {product.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    className="img-fluid"
                    alt={`小圖${index + 1}`}
                    width={90} // 設定圖片的寬度
                    height={90} // 設定圖片的高度
                    priority
                    unoptimized
                  />
                ))}
              </div>
              <div className="rent-rules d-flex flex-column">
                <p className="rules-title">租借規則</p>
                <ul className="rules-content">
                  {product.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 文字區域 */}
            <div className="px-3 col-12 col-md-6 col-lg-6 mx-auto d-flex flex-column details-text">
              <div className="details-titles d-flex flex-column">
                <p className="product-brand">{product.brand}</p>
                <div className="product-name-fav d-flex flex-row justify-content-between align-items-center">
                  <p className="product-name">{product.name}</p>
                  <i className="bi bi-heart"></i>
                </div>
                <div className="stars d-flex flex-row">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${
                        i < product.rating ? '-fill' : ''
                      }`}
                    ></i>
                  ))}
                </div>
              </div>
              <div className="subdetails-titles d-flex flex-column">
                <p className="product-price-perday">
                  NT${product.pricePerDay}/日
                </p>
                <p
                  className="product-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></p>
              </div>

              <div className="details-select d-flex flex-column">
                <p className="product-stock">庫存僅剩 {product.stock} 件</p>
                <div className="product-color">
                  <p className="color-title">產品顏色</p>
                  <div className="colors d-flex flex-row">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="product-amount">
                  <p className="amount-title">產品數量</p>
                  <div className="amounts d-flex flex-row align-items-center">
                    <button className="quantity-btn minus">
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="text"
                      className="quantity-input"
                      value="1"
                      readOnly
                    />
                    <button className="quantity-btn plus">
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="booking-date">
                  <p className="booking-title">預訂日期</p>
                  <div className="booking-calendar">
                    <div id="fixed-calendar"></div>
                    <div className="d-flex flex-column selected-date-range w-100">
                      <p id="date-range-text"></p>
                      <p id="total-cost-text">總費用 xxx 元</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center product-btns">
                <button type="button" className="mybtn btn-cart flex-grow-1">
                  加入購物車
                </button>
                <button type="button" className="mybtn btn-buy flex-grow-1">
                  直接購買
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 商品描述以及品牌介紹區塊 */}
        <div className="col-9 mx-auto d-flex flex-column mt-4 under-details">
          <div className="under-detail">
            <p className="under-details-title">商品描述</p>
            <div className="d-flex flex-column under-details-content">
              {/* 商品描述內容 */}
              <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
            </div>
          </div>
          <div className="d-flex flex-column under-brand">
            <p className="product-brand">品牌介紹</p>
            <div className="d-flex flex-column under-details-brand">
              來自義大利的複合材料製造商C4創立於1986年，初始研發的是自行車使用之碳纖維材料，隨後將這樣的材料技術延伸至自由潛水/水中漁獵的裝備；卓越的性能與粗獷的外型，受到許多專業玩家的喜愛。
            </div>
          </div>
        </div>

        {/* 你可能會喜歡區塊 */}
        <div className="col-9 mx-auto d-flex flex-column mt-4 you-may-likes">
          <div className="you-may-like">
            <h3 className="you-may-like-title">你可能會喜歡</h3>
          </div>
          <div className="row you-may-like-products">
            {/* 單個商品 */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="col-12 col-sm-6 col-md-4 col-lg-3 you-may-like-product mb-4"
              >
                <div className="card border-0 h-100">
                  <Image
                    src="../../images/rent/1732690021_5668.jpg"
                    className="card-img-top product-img w-100"
                    alt="TRYGONS液態面鏡"
                    width={148} // 設定圖片的寬度
                    height={148} // 設定圖片的高度
                    layout="responsive"
                    priority
                    unoptimized
                  />
                  <div className="py-2 px-0 d-flex flex-column justify-content-start align-items-center card-body">
                    <p className="product-brand">TRYGONS</p>
                    <p className="product-name">液態面鏡</p>
                    <h6 className="product-price">NT $740</h6>
                    <h6 className="product-price2">NT $350</h6>
                    <div className="d-flex flex-row justify-content-center align-items-center product-color">
                      <span
                        className="color-box"
                        style={{ backgroundColor: '#4d4244' }}
                      ></span>
                      <span
                        className="color-box"
                        style={{ backgroundColor: '#403f6f' }}
                      ></span>
                      <span
                        className="color-box"
                        style={{ backgroundColor: 'white' }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* 分頁 */}
            <nav aria-label="Page navigation">
              <ul className="px-3 pagination justify-content-center">
                <li className="page-item">
                  <a className="page-link" href="" aria-label="Previous">
                    <span aria-hidden="true">
                      <i className="bi bi-chevron-left"></i>
                    </span>
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="" aria-label="Next">
                    <span aria-hidden="true">
                      <i className="bi bi-chevron-right"></i>
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailUI
