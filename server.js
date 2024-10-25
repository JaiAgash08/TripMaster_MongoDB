const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const path = require('path');
const session = require('express-session');

const uri = 'mongodb://localhost:27017';
const dbName = 'tripmaster_db';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

// Session setup
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true
}));

// Serve HTML files for user and admin flows
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/book.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'book.html'));
});

app.get('/admin_signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_signup.html')); // Admin signup page
});

app.get('/admin_signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_signin.html')); // Admin signin page
});

app.get('/admin_dashboard.html', (req, res) => {
    if (req.session.isAdminLoggedIn) {
        res.sendFile(path.join(__dirname, 'admin_dashboard.html')); // Admin dashboard page
    } else {
        res.redirect('/admin_signin.html');
    }
});

// Sign up endpoint for users
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection('user_details');

    try {
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { username, email, password: hashedPassword };

        const result = await collection.insertOne(userData);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Sign in endpoint for users
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection('user_details');

    try {
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please sign up first.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // User login success
        res.status(200).json({ message: 'Sign-in successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error during sign-in', error: error.message });
    }
});
// Booking endpoint
app.post('/book', async (req, res) => {
    const { name, email, destination, date, duration, num_people, other_info } = req.body;

    if (!name || !email || !destination || !date || !duration || !num_people) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const bookingsCollection = db.collection('bookings');

        // Create a booking document
        const bookingData = {
            name,
            email,
            destination,
            date: new Date(date), // Convert date string to Date object
            duration: parseInt(duration), // Ensure duration is a number
            num_people: parseInt(num_people), // Ensure num_people is a number
            other_info: other_info || ''
        };

        // Insert booking data into the bookings collection
        await bookingsCollection.insertOne(bookingData);

        res.status(201).json({ message: 'Booking created successfully!' });
    } catch (error) {
        console.error('Error during booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Admin sign-up endpoint
// Admin Signup Route
app.post('/admin_signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const adminsCollection = db.collection('admins');

        const existingAdmin = await adminsCollection.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await adminsCollection.insertOne({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error during admin signup:', error);
        res.status(500).json({ message: 'Error during signup' });
    }
});

// Admin Signin Route
app.post('/admin_signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectToDatabase();
        const adminsCollection = db.collection('admins');

        const admin = await adminsCollection.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        req.session.admin = admin; // Store admin in session
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during admin signin:', error);
        res.status(500).json({ message: 'Error during signin' });
    }
});

// Fetch booking details only
// Fetch booking details only
app.get('/get_booking_details', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const bookingsCollection = db.collection('bookings'); // Collection for bookings
        const usersCollection = db.collection('user_details'); // Collection for users

        const bookings = await bookingsCollection.find().toArray(); // Fetch all bookings

        // Create an array to hold the booking details
        const bookingDetails = await Promise.all(bookings.map(async (booking) => {
            // Fetch user details based on email
            const user = await usersCollection.findOne({ email: booking.email });

            // Parse the date correctly as a Date object
            const bookingDate = new Date(booking.date);
            const formattedDate = bookingDate instanceof Date && !isNaN(bookingDate.getTime())
                ? bookingDate.toLocaleDateString() // Format to local date string
                : 'Invalid Date'; // Fallback for invalid dates

            return {
                bookingId: booking._id,
                name: user ? user.username : 'N/A', // Assuming 'username' is the field in user_details
                email: booking.email,
                destination: booking.destination,
                date: formattedDate, // Use the formatted date
                duration: booking.duration,
                num_people: booking.num_people,
                other_info: booking.other_info || 'N/A'
            };
        }));

        res.status(200).json(bookingDetails);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: 'Error fetching booking data', error: error.message });
    }
});





// Admin Logout Route
app.post('/admin_logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});
// MongoDB connection function
const connectToDatabase = async () => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
