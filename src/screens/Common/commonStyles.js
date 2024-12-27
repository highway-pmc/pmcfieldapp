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
});

export default commonStyles;