// commonStyles.js
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    separatTaskType: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#1c58c0',
        marginTop: 10,
        paddingBottom: 10,
        backgroundColor: '#eaf0fa',
    },
    titleTextForGrouping: {
        backgroundColor: '#acc2e9',
        paddingBottom: 7, 
        paddingTop: 7,
        paddingLeft: 10,
        borderRadius: 4
    },
    titleText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textTransform: 'capitalize'
    },
    paddingBottom20: {
        paddingBottom: 20
    },
    iconsStyle: {
        backgroundColor: '#fff',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        opacity: .7,
        height: 105,
        position: 'absolute',
        left: 0,
        top: 0,
        width: 70,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    rightStyle: {
        width: 50,
    },
    CloseIcon: {
        width: 45,
        height: 45,
        tintColor: '#fff'
    },
    image: {
        width: 40,
        height: 40,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    rightAlignBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 7,
    },
    outLineBtn: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#1C58C0',
        paddingHorizontal: 10,
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        backgroundColor: '#fff'
    },
    btnTextSize: {
        fontSize: 12,
        fontWeight: '400',
        color: '#1C58C0'
    },
    addSourceIcon: {
        width: 18,
        height: 18,
    },
    sourceApprovalsBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#BECADA',
        borderRadius: 6,
        marginBottom: 12
    },
    boxRowWithBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        gap: 7,
    },
    actionTypeIcon: {
        width: 18,
        height: 18,
    },
    editAddDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 7,
    },
    editAddDeleteIcons: {
        width: 25,
        height: 25,
    },
    sourceContent: {
        flex: 1,
    },
    sourceContentSize: {
        fontSize: 14,
        fontWeight: '400',
        color: '#333'
    },
    approvalRejectedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderTopWidth: 1,
        borderTopColor: '#BECADA',
    },
    subActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    approveText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#21C043'
    },
    rejectText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#DD0302'
    },
    //RFI' LAB Test Toggle CSS
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 5,
        alignSelf: "center",
        marginBottom: 10,
      },
      toggleButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        borderRadius: 8,
      },
      activeToggleButton: {
        backgroundColor: "#007BFF",
      },
      toggleText: {
        fontSize: 16,
        color: "#333",
      },
      activeToggleText: {
        color: "#fff",
        fontWeight: "bold",
      },
});

export default commonStyles;