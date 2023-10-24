export const updateFCMToken = (fcmToken) => ({
    type: "SET_FCM_TOKEN_REQUEST",
    payload: {
        fcmToken: fcmToken,
    },
});

export const clearDashboardEventData = () => ({
    type: "CLEAR_DASHBOARD_EVENT_DATA"
});
