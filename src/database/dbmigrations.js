const dbMigrations = {}

dbMigrations.config = {
    version: '1.0',
    name: 'HighwayPMC',
    displayName: 'HighwayPMC Db',
    location: 'default',
    size: (30 * 1024 * 1024)
};

dbMigrations.changeset = {
    createMember: 'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, phone TEXT, password TEXT, role TEXT, isPasswordSet BOOLEAN)',
};

dbMigrations.setTest = (val) => {
    _value = val;
}

dbMigrations.getTest = () => {
    return _value;
}

export {
    dbMigrations
}