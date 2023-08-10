import { globals } from "../app/globals";
import SQLite from "react-native-sqlite-storage"
import { dbMigrations } from "./dbmigrations";
let postMigrationCallback, database;

const schema = {};

schema.connect = (config) => {
    if (!globals.database);
    globals.database = SQLite.openDatabase(config, () => {
        console.log("Database connected!")
    }, (error) => {
        console.log("Database error", error)
    });

    database = globals.database;
    return schema;
};

schema.runMigrations = (callback) => {
    postMigrationCallback = callback;
    bootstrap(computeDelta);
};

const bootstrap = (successCallback) => {
    var executor = (txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS SCHEMA_CHANGES (name TEXT PRIMARY KEY)');
    };
    database.transaction(executor, () => {
    }, successCallback);
};

const computeDelta = () => {
    database.transaction((txn) => {
        txn.executeSql('SELECT name FROM SCHEMA_CHANGES', [], (tx, results) => {
            const appliedChanges = getAppliedChanges(results);
            const delta = {};
            for (let property in dbMigrations.changeset) {
                if (appliedChanges.indexOf(property) == -1) {
                    delta[property] = dbMigrations.changeset[property];
                }
            }
            applyChanges(delta);
        });
    });
};

const getAppliedChanges = (results) => {
    let len = results.rows.length;
    let appliedChanges = [];
    for (let index = 0; index < len; index++) {
        appliedChanges[index] = results.rows.item(index).name;
    }
    return appliedChanges;
};

const applyChanges = (changes) => {
    database.transaction((txn) => {
        for (let name in changes) {
            txn.executeSql(changes[name]);
            txn.executeSql('INSERT INTO SCHEMA_CHANGES (name) VALUES ("' + name + '") ');
        }
    }, null, postMigrationCallback);
};

export {
    schema
}