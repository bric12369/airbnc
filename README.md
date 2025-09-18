# AirBNC

AirBNC is a backend API inspired by Airbnb, built with Node.js, Express, and PostgreSQL. It follows RESTful design principles, uses Supabase for database hosting, and is deployed on Render. I'm currently developing the frontend using React.

## 🛠️ Tech Stack

**Server:** Node.js | Express
**Database:** PostgreSQL | Supabase
**Deployment:** Render (Backend)

## 💪 Getting Started

### 1: Install Dependencies

Ensure you've installed all dependencies using:
```
npm install
```

### 2: Create Local Databases

Next, you will need to create two databases locally, `airbnc_test` and `airbnc`. A script has been created to achieve this. Run:

```
npm run setup-db
```

### 3: Set up environment variables:

You'll need to store the credentials of the databases inside .env files at the root level of this project (remember to add `.env*` to your .gitignore). 

Inside `.env.test`, store: 

```
PGDATABASE=airbnc_test
```

Inside `.env.development`, store: 

```
PGDATABASE=airbnc
```

### 4: Seed the Databases

The test database is seeded automatically each time the test suite is run. To seed the development database, run: 

```
npm run seed
```

### 5: Run the Development Server

To start the development server locally, run:

```
npm run dev
```

Then go to `localhost:9090` in your browser or API client (e.g. Postman) to explore different endpoints.

## 💻 Live API

The backend API is live and accessible here: [https://airbnc-1-9uw3.onrender.com/](https://airbnc-1-9uw3.onrender.com/)

You can use this URL to test the API without running it locally.