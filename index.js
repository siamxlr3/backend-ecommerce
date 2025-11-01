const express = require('express');
const app = express();
const mongoose=require('mongoose');
const cors=require('cors');
const cookieParser=require('cookie-parser');


const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:[ 'http://localhost:5173','https://aurellia-e-commerce-indol.vercel.app/'],
    credentials: true,
}));


const Userroute=require('./src/users/user.route')
const Productroute=require('./src/products/product.route')
const Reviewroute=require('./src/reviews/review.route')
const Orderroute=require('./src/orders/order.route')
const Stateroute=require('./src/stats/state.route')

app.use('/api/auth',Userroute)
app.use('/api/product',Productroute)
app.use('/api/review',Reviewroute)
app.use('/api/order',Orderroute)
app.use('/api/state',Stateroute)

async function main(){
    await mongoose.connect(process.env.UB_URL);

    app.get('/', (req, res) => {
        res.send('Welcome to the Shopping App!');
    })
}
main().then(()=>console.log("mongoDB connected")).catch(err => console.log(err));


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})