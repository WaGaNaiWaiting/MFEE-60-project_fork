"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname();
    const pathes = pathname.split("/").filter(Boolean);

    let fullPath = "";

    const breadcrumbNames = {
        "activity": "活動列表",
        "detail": "活動詳情"
    };

    const breadcrumbItems = pathes.map((segment, index) => {
        fullPath += `/${segment}`; // 每次迭代都加上新的路徑

        return (
            <li key={index} className="breadcrumb-item">
                <Link className="a" href={fullPath}>{breadcrumbNames[segment]}</Link>
            </li>
        );
    });

    return (
        <div className="bread container d-none d-sm-block">
            <nav aria-label="breadcrumb">
                <ol className="m-0 breadcrumb breadcrumb-list">
                    <li className="breadcrumb-item">
                        <a className="a" href="#">
                            首頁
                        </a>
                    </li>
                    {breadcrumbItems}
                </ol>
            </nav>
        </div>
    );
}
