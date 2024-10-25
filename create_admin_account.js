const mongoose = require('mongoose');
const Admin = require('./models/admin');

mongoose.connect('mongodb://localhost:27017/tripmaster_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    const admin = new Admin({
        email: 'admin@tripmaster.com',
        password: 'admin123' // Default admin credentials
    });

    await admin.save();
    console.log('Default admin account created successfully!');
    mongoose.connection.close();
})
.catch(err => console.error('MongoDB connection error:', err));
