# AirBNC

...about the project

## Getting Started

1: Ensure you've installed all dependencies using
```
npm install
```

2: Next, you will need to create your test and dev databases, `airbnc_test` and `airbnc` locally. A script has been created to achieve this. Run:

```
npm run setup-db
```

3: You'll need to store the credentials of the databases inside .env files at the root level of this project. Inside .env.test, store: 

```
PGDATABASE=airbnc_test
```

4: Inside .env.development, store: 

```
PGDATABASE=airbnc
```

5: Next, you need to seed the database. The test database is seeded automatically each time the test suite is run. To seed the devlopment database, run: 

```
npm run seed
```

6: Now you can run the development database locally to see all the ways you can interact with it, along with some example interactions. Run the below then navigate to `localhost:9090` in your browser:

```
npm run dev
```