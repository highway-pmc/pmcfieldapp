const { Alert } = require("react-native");
const { globals } = require("../app/globals");

const database = () => {
    return globals.database
  };

//insert a new user record
const createUser = () => {
    let sql = "INSERT INTO user (email, name) VALUES (?, ?)";
    let params = ["rajivse2007@gmail.com", "Rajiv Ranjan"];
    database().executeSql(sql, params, (result) => {
        Alert.alert("Success", "User created successfully.");
    }, (error) => {
        Alert.alert("Create user error", error);
    });
}

//list all the users
const listUsers = async () => {
    let sql = "SELECT * FROM user";
    database().transaction((tx) => {
        tx.executeSql(sql, [], (tx, resultSet) => {
            var length = resultSet.rows.length;
            for (var i = 0; i < length; i++) {
                console.log(resultSet.rows.item(i));
            }
        }, (error) => {
            console.log("List user error", error);
        })
    })
}

export {
    createUser,
    listUsers
}
