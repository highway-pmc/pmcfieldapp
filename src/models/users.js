import { db } from "../database/db";
import { dbMigrations } from "../database/dbmigrations";

const users = {};

const tableName = dbMigrations.tables.user;

users.findById = async(id) => {
    return db.findById(tableName, id).then((result) => {
        return result;
    }).catch((error) => {
        throw error;
    });
}

users.getAll = async() => {
    return db.getAll(tableName).then((result) => {
        return result;
    }).catch((error) => {
        throw error;
    });
}

users.findByEmail = async(email) => {
    const sql = `SELECT * FROM ${tableName} WHERE email = ? COLLATE NOCASE`
    return db.executeSql(sql, [email]).then((result) => {
        return result.length ? result.item(0) : null;
    }).catch((error) => {
        throw error;
    });
}

users.login = async(email, password) => {
    const sql = `SELECT * FROM ${tableName} WHERE email = ? COLLATE NOCASE AND password = ?`
    return db.executeSql(sql, [email, password]).then((result) => {
        return result.length ? result.item(0) : null;
    }).catch((error) => {
        throw error;
    });
}

// users.count = async() => {
//     const sql = `SELECT COUNT(*) FROM ${tableName} WHERE email = ?`
//     return db.executeSql(sql, ["asdas"]).then((result) => {
//         return result.length;
//     }).catch((error) => {
//         throw error;
//     });
// }

users.save = async(entity) => {
    console.log("======",entity)
    return db.save(tableName, entity).then((result) => {
        entity.id = result.insertId;
        return entity;
    }).catch((error) => {
        throw error;
    });
}

users.update = async(entity) => {
    return db.update(tableName, entity).then((result) => {
        return result.rowsAffected;
    }).catch((error) => {
        throw error;
    });
}

users.deleteById = async(id) => {
    return db.deleteById(tableName, id).then((result) => {
        return result.rowsAffected;
    }).catch((error) => {
        throw error;
    });
}

export {
    users
}