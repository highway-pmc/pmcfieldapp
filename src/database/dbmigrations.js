const dbMigrations = {}

dbMigrations.config = {
    version: '1.0',
    name: 'HighwayPMC',
    displayName: 'HighwayPMC Db',
    location: 'default',
    size: (30 * 1024 * 1024)
};

dbMigrations.tables = {
    user: 'user'
};

dbMigrations.changeset = {
    createMember: 'CREATE TABLE IF NOT EXISTS ' + dbMigrations.tables.user + '(id INTEGER PRIMARY KEY AUTOINCREMENT, _id TEXT, email TEXT, name TEXT, phone TEXT, password TEXT, roles TEXT, designation TEXT, authToken TEXT, isPasswordSet INTEGER DEFAULT 0)',
};

export {
    dbMigrations
}