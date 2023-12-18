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

export const OPTIONS_SELECT_STATUS_HANDLE_FEEDBACK = [
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


export const OPTIONS_SELECT_STATUS_COLLABORATOR = [
    {
        label: "Chưa xử lý",
        value: "pending",
        color: color1,
        className: 'status-not-process',
        disableSelect: true,
    },
    {
        label: "Đã liên hệ",
        value: "contacted",
        color: color2,
        className: 'status-processing'
    },
    // {
    //     label: "Chưa xác thực",
    //     value: "not_verify",
    //     color: color1,
    //     className: 'status-not-contact'
    // },
    {
        label: "Đang hoạt động",
        value: "online",
        color: color3,
        className: 'status-done'
    },
    {
        label: "Đã khoá",
        value: "lock",
        color: color1,
        className: 'status-not-contact'
    }
]

export const OPTIONS_SELECT_STATUS_COLLABORATOR_VERIFY = [
    {
        label: "Đang hoạt động",
        value: "actived",
        color: color1,
        className: 'status-done',
    },
    {
        label: "Đã khoá",
        value: "locked",
        color: color1,
        className: 'status-not-contact'
    }
]

export const OPTIONS_SELECT_STATUS_COLLABORATOR_NOT_VERIFY = [
    {
        label: "Chưa xử lý",
        value: "pending",
        color: color1,
        className: 'status-not-process',
        disableSelect: true,
    },
    {
        label: "Hoàn thành test",
        value: "test_complete",
        color: color1,
        className: 'status-processing',
    },
    {
        label: "Đã liên hệ",
        value: "contacted",
        color: color1,
        className: 'status-processing',
    },
    {
        label: "Hẹn phỏng vấn",
        value: "interview",
        color: color1,
        className: 'status-processing',
    },
    {
        label: "Từ chối",
        value: "reject",
        color: color1,
        className: 'status-not-contact',
    },
    {
        label: "Kích hoạt",
        value: "actived",
        color: color1,
        className: 'status-done',
    },
]