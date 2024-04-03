const express = require('express')
require('dotenv').config();
require('./database/connection');

// middleware imports
const morgan = require('morgan');

// import routes
const testRoute = require('./routes/testRoute');
const CategoryRoute = require('./routes/categoryRoute');
const ProductRoute = require('./routes/productRoute');
const UserRoute = require('./routes/userRoute');

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(morgan('dev'));


// using Routes
app.use('/api', testRoute);
app.use('/api', CategoryRoute);
app.use('/api', ProductRoute);
app.use('/api', UserRoute);

app.use('/public/uploads', express.static('public/uploads'))


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
