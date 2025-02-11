"use client";
import "./styles.css";

export default function GroupDetailPage() {
    return (
        <main className="container d-flex">
            <aside className="d-none d-md-block">篩選列</aside>
            <div className="group-create d-flex flex-column w-100">
                <h2 className="m-0">新增揪團</h2>
                <div className="row">
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                        <div className="fs-22px">
                            上傳首圖 <span className="color-secondary">*</span>
                        </div>
                        <div className="img-container">
                            <img src="#" alt="" />
                        </div>
                        <input type="file" />
                        <div className="text-secondary">檔案上傳限制：3MB</div>
                    </div>
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">上傳其他圖片</div>
                        <div className="img-container">
                            <img src="#" alt="" />
                        </div>
                        <input type="file" />
                        <div className="text-secondary">檔案上傳限制：3MB</div>
                    </div>
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團標題 <span className="color-secondary">*</span>
                    </div>
                    <input className="form-control" type="text" name="" id="" />
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團性別 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="" id="" defaultValue="default">
                        <option value="default" disabled>
                            請選擇揪團性別
                        </option>
                        <option value>生理男性</option>
                        <option value>生理女性</option>
                        <option value>不限性別</option>
                    </select>
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團分類 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="" id="" defaultValue="default">
                        <option value="default" disabled>
                            請選擇揪團分類
                        </option>
                        <option value>浮潛</option>
                        <option value>自由潛水</option>
                        <option value>水肺潛水</option>
                        <option value>其他</option>
                    </select>
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        證照資格 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select" name="" id="" defaultValue="default">
                        <option value="default" disabled>
                            請選擇是否需要證照
                        </option>
                        <option value>無須證照</option>
                        <option value>需OWD證照</option>
                        <option value>需AOWD證照</option>
                    </select>
                </div>
                <div>
                    <div className="fs-22px mb-15px">
                        揪團地點 <span className="color-secondary">*</span>
                    </div>
                    <select className="form-select mb-15px" name="" id="" defaultValue="default">
                        <option  value="default" disabled>
                            請選擇揪團國家
                        </option>
                        <option value>台灣</option>
                        <option value>日本</option>
                        <option value>菲律賓</option>
                        <option value>其他</option>
                    </select>
                    <select className="form-select" name="" id="" defaultValue="default">
                        <option  value="default" disabled>
                            請先選擇國家
                        </option>
                    </select>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                        <div className="fs-22px">
                            活動日期 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="date" />
                    </div>
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">
                            活動時間 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="time" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3 row-first">
                        <div className="fs-22px">
                            揪團截止日期 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="date" />
                    </div>
                    <div className="col-12 col-sm-6 d-flex flex-column gap-3">
                        <div className="fs-22px">
                            揪團截止時間 <span className="color-secondary">*</span>
                        </div>
                        <input className="form-control" type="time" />
                    </div>
                </div>
                <div>
                    <div className="fs-22px mb-15px">揪團資訊</div>
                    <textarea
                        className="form-control"
                        name=""
                        id=""
                        rows={5}
                        defaultValue={""}
                    />
                </div>
            </div>
        </main>
    );
}
