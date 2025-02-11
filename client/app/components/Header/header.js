"use client";
import { useState } from "react";
import { FaSearch, FaRegUser, FaBars } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import HeaderPop from "./headerPop"; // 引入 HeaderPop 組件

export default function Header() {
  const [showPop, setShowPop] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setShowPop(true);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setShowPop(false);
    setActiveMenu(null);
  };

  return (
    <header className="sticky-top">
      <div className="header-container" onMouseLeave={handleMouseLeave}>
        <nav className="container">
          <div className="d-none d-sm-flex">
            <div className="header-icon-container">
              <img src="/image/DiveIn logo-light.png" alt="Logo" />
            </div>
            <div className="header-list d-flex justify-content-between align-items-center">
              <ul className="m-0 d-flex justify-content-between align-items-center list-unstyled">
                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => {
                      setShowPop(false);
                    }}
                  >
                    首頁
                  </Link>
                </li>

                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => handleMouseEnter("products")}
                  >
                    商品
                  </Link>
                </li>
                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => handleMouseEnter("events")}
                  >
                    活動
                  </Link>
                </li>
                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => handleMouseEnter("rental")}
                  >
                    租借
                  </Link>
                </li>
                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => handleMouseEnter("group")}
                  >
                    揪團
                  </Link>
                </li>
                <li className="px-3 py-2">
                  <Link
                    className="a"
                    href="#"
                    onMouseEnter={() => handleMouseEnter("forum")}
                  >
                    論壇
                  </Link>
                </li>
              </ul>
            </div>
            <div className="header-right-box d-flex justify-content-end align-items-center">
              <form className="d-flex search-box" action="">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                />
                <button className="btn">
                  <FaSearch className="text-secondary vstack text-center" />
                </button>
              </form>
              <a href="#" className="header-cart a">
                <FiShoppingCart />
              </a>
              <a href="#" className="header-cart a">
                <FaRegUser />
              </a>
            </div>
          </div>
        </nav>
        <HeaderPop show={showPop} activeMenu={activeMenu} />
      </div>
    </header>
  );
}
