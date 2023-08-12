const { Alert } = require("react-native");
const { globals } = require("../app/globals");

const database = () => {
    return globals.database
};

const sanitizeValue = (value) => {
    return (typeof value === 'string' ? value.replace(/'/g, "''") : value);
  }

const valueToInsert = (value) => {
    return typeof(value) == "number" ? value : typeof(value) == "boolean" ? (value ? 1 : 0) : ("'" + value + "'");
  };

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

const db = {};

db.executeSql = (sql, params = []) => new Promise((resolve, reject) => {
    database().transaction((trans) => {
        trans.executeSql(sql, params, (trans, results) => {
            resolve(results.rows);
        },
            (error) => {
                reject(error);
            });
    });
});

db.findOne = (sql, params = []) => new Promise((resolve, reject) => {
    database().transaction((trans) => {
        trans.executeSql(sql, params, (trans, results) => {
            resolve(results.rows.item(0));
        },
            (error) => {
                reject(error);
            });
    });
});

db.findById = (tableName, id) => new Promise((resolve, reject) => {
    if(!id) {
        reject({message : "Entity " + tableName + " has no id"})
    }
    
    const sql = `SELECT * FROM ${tableName} WHERE id=${id}`;
    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, results) => {
            resolve(results.rows.item(0));
        },
            (error) => {
                reject(error);
            });
    });
});

db.deleteById = (tableName, id) => new Promise((resolve, reject) => {
    if(!id) {
        reject({message : "Entity " + tableName + " has no id"})
    }
    
    const sql = `DELETE FROM ${tableName} WHERE id=${id}`;

    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, results) => {
            Alert.alert(JSON.stringify(results))
            resolve(results.rowsAffected);
        },
            (error) => {
                reject(error);
            });
    });
});

db.deleteAll = (tableName) => new Promise((resolve, reject) => {
    const sql = `DELETE FROM ${tableName}`;

    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, results) => {
            resolve(results.rowsAffected);
        },
            (error) => {
                reject(error);
            });
    });
});

db.save = (tableName, entity = {}) => new Promise((resolve, reject) => {
    let values = "(";
    let len = Object.keys(entity).length, index = 0;
    for (let key in entity) {
        values = values + valueToInsert(sanitizeValue(entity[key]));
        if (index < (len - 1)) {
            values = values + ", "
        }
        index++;
    }
    values += ")";

    const sql = `INSERT INTO ${tableName} (${Object.keys(entity)}) VALUES ${values}`;

    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, results) => {
            resolve(results);
        },
            (error) => {
                reject(error);
            });
    });
});

db.update = (tableName, entity = {}) => new Promise((resolve, reject) => {
    if(!entity.id) {
        reject({message : "Entity " + tableName + " has no id"})
    }
    let updateValues = "";
    let len = Object.keys(entity).length, index = 0;
    for (let key in entity) {
        if (key != 'id') {
            updateValues = updateValues + (key + '=' + valueToInsert(sanitizeValue(entity[key])));
            if (index < (len - 1)) {
                updateValues = updateValues + ", ";
            }
        }
        index++;
    }
    
    const sql = `UPDATE ${tableName} SET ${updateValues} WHERE id=${entity.id}`;
    console.log(sql)
    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, result) => {
            resolve(result);
        },
            (error) => {
                reject(error);
            });
    });
});

db.bulkInsertSql = (tableName, items = []) => new Promise((resolve, reject) => {
    if (!items || !items.length) {
        resolve();
    }
    
    let sql = `INSERT INTO ${tableName} (${Object.keys(items[0])}) VALUES`;
    sql = sql + items.map(item => {
        let values = "(";
        let len = Object.keys(item).length, index = 0;
        for (let key in item) {
            values = values + valueToInsert(sanitizeValue(item[key]));
            if (index < (len - 1)) {
                values = values + ", "
            }
            index++;
        }
        values += ")"
        return values;
    })

    Alert.alert(sql);

    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, results) => {
            Alert.alert(JSON.stringify(results));
            resolve(results);
        },
            (error) => {
                Alert.alert(JSON.stringify(error));
                reject(error);
            });
    });
});

db.getAll = (tableName) => new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${tableName}`;
    const itemArray = [];
    database().transaction((trans) => {
        trans.executeSql(sql, [], (trans, resultSet) => {
            var length = resultSet.rows.length;
            for (var i = 0; i < length; i++) {
                itemArray.push(resultSet.rows.item(i));
            }
            resolve(itemArray);
        },
            (error) => {
                reject(error);
            });
    });
});

export {
    db
}
