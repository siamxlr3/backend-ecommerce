const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.options('*', cors({
    origin: ['https://aurellia.vercel.app'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const Userroute = require('./src/users/user.route');
const Productroute = require('./src/products/product.route');
const Reviewroute = require('./src/reviews/review.route');
const Orderroute = require('./src/orders/order.route');
const Stateroute = require('./src/stats/state.route');

app.use('/api/auth', Userroute);
app.use('/api/product', Productroute);
app.use('/api/review', Reviewroute);
app.use('/api/order', Orderroute);
app.use('/api/state', Stateroute);

app.get('/', (req, res) => {
    res.send('Welcome to the Shopping App!');
});

async function main() {
    try {
        await mongoose.connect(process.env.UB_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

main().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
