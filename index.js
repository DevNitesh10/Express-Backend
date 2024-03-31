const express = require('express')
require('dotenv').config();
require('./database/connection');

// middleware imports
const morgan = require('morgan');

// import routes
const testRoute = require('./routes/testRoute');
const CategoryRoute = require('./routes/categoryRoute');
const ProductRoute = require('./routes/productRoute');

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(morgan('dev'));


// using Routes
app.use('/api', testRoute);
app.use(CategoryRoute);
app.use(ProductRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
