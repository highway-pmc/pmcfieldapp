import { globals } from "../app/globals";
import SQLite from "react-native-sqlite-storage"
import { dbMigrations } from "./dbmigrations";
var postMigrationCallback, database;

var schema = {};

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

var bootstrap = (successCallback) => {
    var executor = (txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS SCHEMA_CHANGES (name TEXT PRIMARY KEY)');
    };
    database.transaction(executor, () => {
    }, successCallback);
};

var computeDelta = () => {
    database.transaction((txn) => {
        txn.executeSql('SELECT name FROM SCHEMA_CHANGES', [], (tx, results) => {
            var appliedChanges = getAppliedChanges(results);
            var delta = {};
            for (var property in dbMigrations.changeset) {
                if (appliedChanges.indexOf(property) == -1) {
                    delta[property] = dbMigrations.changeset[property];
                }
            }
            applyChanges(delta);
        });
    });
};

var getAppliedChanges = (results) => {
    var len = results.rows.length;
    var appliedChanges = [];
    for (var index = 0; index < len; index++) {
        appliedChanges[index] = results.rows.item(index).name;
    }
    return appliedChanges;
};

var applyChanges = (changes) => {
    database.transaction((txn) => {
        for (var name in changes) {
            txn.executeSql(changes[name]);
            txn.executeSql('INSERT INTO SCHEMA_CHANGES (name) VALUES ("' + name + '") ');
        }
    }, null, postMigrationCallback);
};

export {
    schema
}