import moment from 'moment';

const groupBy = (arr, property) => {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
};

const isTestInventoryClassification = (testClassificationName) => {
    // TODO: need to introduce types in db and use them here iso name
    return (testClassificationName === 'Source Approvals' || testClassificationName === 'Procurement Details');
}

const getDbDate = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD');
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
    getDbDate,
    getDisplayDate,
    getDisplayTime,
}