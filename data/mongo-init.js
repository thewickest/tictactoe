db = db.getSiblingDB(process.env.DATABASE_NAME)


db.createUser({
    user: process.env.DATABASE_USER,
    pwd: process.env.DATABASE_PASSWORD,
    roles: [
      {
        role: 'dbOwner',
        db: process.env.DATABASE_NAME,
      },
  ],
});