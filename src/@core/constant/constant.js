const color1 = "#2463eb"
const color2 = "#c88a04"
const color3 = "#dc2828"



export const OPTIONS_SELECT_STATUS_HANDLE_REVIEW = [
    {
        label: "Chưa xử lý",
        value: "pending",
        color: color1,
        className: 'status-pending'
    },
    {
        label: "Đang xử lý",
        value: "processing",
        color: color2,
        className: 'status-processing'
    },
    {
        label: "Chưa liên hệ được",
        value: "not_contact",
        color: color1,
        className: 'status-not-contact'
    },
    {
        label: "Hoàn thành",
        value: "done",
        color: color3,
        disableSelect: true,
        className: 'status-done'
    }
    
]