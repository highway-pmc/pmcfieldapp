import moment from 'moment';
import { TEST_CLASSIFICATION_TYPES } from '../constants/constants';

const groupBy = (arr, property) => {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
};

const isTestInventoryClassification = (testClassificationType) => {
    // TODO: need to introduce types in db and use them here iso name
    return (testClassificationType === TEST_CLASSIFICATION_TYPES.SOURCE_APPROVALS || testClassificationType === TEST_CLASSIFICATION_TYPES.PROCUREMENT_DETAILS);
}

const isStoreClassification = (testClassificationType) => {
    // TODO: need to introduce types in db and use them here iso name
    return (testClassificationType === TEST_CLASSIFICATION_TYPES.STORES);
}

const isProductionClassification = (testClassificationType) => {
    // TODO: need to introduce types in db and use them here iso name
    return (testClassificationType === TEST_CLASSIFICATION_TYPES.PRODUCTION);
}

const getDbDate = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD');
}

const getDbDateFromDDMMYYYY = (dateString) => {
    const dateArray = dateString.split('/');
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
}

const getDisplayDate = (date) => {
    return moment(new Date(date)).format('DD/MM/YYYY');
}

const getDisplayTime = (date) => {
    return moment(new Date(date)).format('hh:mm A');
}

export {
    groupBy,
    isTestInventoryClassification,
    isStoreClassification,
    isProductionClassification,
    getDbDate,
    getDbDateFromDDMMYYYY,
    getDisplayDate,
    getDisplayTime,
}