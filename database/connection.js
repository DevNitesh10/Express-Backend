const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));