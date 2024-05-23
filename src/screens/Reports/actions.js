export const actionGetRFIsReports = (payload) => ({
    type: "GET_RFI_REPORTS_REQUEST",
    payload: payload
});

export const actionDownloadRFIsReports = (payload) => ({
    type: "DOWNLOAD_REPORT_REQUEST",
    payload: payload
});

export const clearRFIReportsEvent = () => ({
    type: "CLEAR_RFI_REPORTS_REQUEST"
});