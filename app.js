const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;

dotenv.config();

const usersRoutes = require('./routes/users-routes');
const operatorRoutes = require('./routes/operator-routes');
const categoryRoutes = require('./routes/category-routes');
const entrieRoutes = require('./routes/entrie-routes');
const recordRoutes = require('./routes/record-routes')
const operationRouted = require('./routes/operation-routes');
const fieldRoutes = require('./routes/field-routes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/entries', entrieRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/operations', operationRouted);
app.use('/api/fields', fieldRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qb3xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
    .connect(
        connectionString,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => app.listen(port, () => console.log(`Server is running on http://localhost:${port}`)))
    .catch(err => console.error(err));