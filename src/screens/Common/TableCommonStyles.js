// styles/commonStyles.js

import { StyleSheet } from 'react-native';

const TableCommonStyles = StyleSheet.create({
    tableHeaderContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
        gap: 5,
        backgroundColor: '#f1f1f1'
    },
    headerText: {
        fontWeight: '600',
        fontSize: 12,
    },
    headerCell: {
        alignItems: 'center',
        padding: 5,
    },
});

export default TableCommonStyles;
