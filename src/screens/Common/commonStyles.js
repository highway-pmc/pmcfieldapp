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
    }
});

export default commonStyles;