// commonStyles.js
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    separatTaskType: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#E3E3E3',
        marginTop: 10,
        paddingBottom: 10
    },
    titleTextForGrouping: {
        backgroundColor: '#E3E3E3',
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