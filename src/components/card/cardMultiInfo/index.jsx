import "./index.scss";
import React from "react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";


const CardMultiInfo = (props) => {
    const {
        mainInfo,
        secondInfo
    } = props

    return (
        <React.Fragment>
            <div className="card-multi-info ">
                <div className="main-info">
                    <p className="text-title">{mainInfo.title}</p>
                    <div className="div-detail">
                        <p className="text-detail">{mainInfo.detail}</p>
                        <p className="percent-period">

                            {mainInfo.percentPeriod + " %"}
                            {
                                mainInfo.arrow === "up" ?
                                    (<CaretUpOutlined style={{ marginRight: 5 }} />) :
                                    (<CaretDownOutlined style={{ marginRight: 5 }} />)
                            }
                        </p>
                    </div>

                </div>
                <div className="second-info">
                    {secondInfo.map((item) => {
                        return (
                            <div className="div-info">
                                <p class="text-title">{item.title}</p>
                                <div className="div-detail">
                                    <p class="text-detail">{item.detail}</p>
                                    <p className="percent-period">

                                        {item.percentPeriod + " %"}
                                        {
                                            item.arrow === "up" ?
                                                (<CaretUpOutlined style={{ marginRight: 5 }} />) :
                                                (<CaretDownOutlined style={{ marginRight: 5 }} />)
                                        }
                                    </p>
                                </div>


                            </div>
                        )
                    })}

                </div>
            </div>
        </React.Fragment>
    )
}

export default CardMultiInfo;