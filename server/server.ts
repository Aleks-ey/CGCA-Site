const express = require('express')
const cors = require("cors")
const session = require('express-session')
// const cookieParser = require('cookie-parser');

require('dotenv').config()
const app = express()
app.use(cors({origin: 'http://localhost:3000', credentials: true})) 
app.use(express.json())
// app.use(cookieParser())
var date = new Date()
app.session()
        
// app.use(session(sessionConfig))
const {SERVER_PORT} = process.env
const {
    contact
} = require("./controller/emailController")
const {
    seedUsers,
    newUser,
    login,
    getSes
} = require("./controller/userController")
const {
    getItems,
    getAllOrders,
    dltOrder,
    adminOrder,
    adminItem
} = require("./controller/itemController")
const {
    seed,
    resetOrders,
    checkoutClick,
    resetItems
} = require("./controller/cartController")

// app.get("/api", (req,res) => res.send('Hello World!'))

app.post('/api/getSession', getSes)


app.post("/api/contact", contact)

app.post("/api/resetitems", resetItems)
app.get("/api/adminitems", adminItem)
app.get('/api/adminorders', adminOrder)
app.get("/api/items", getItems)
app.delete("/api/order/:id", dltOrder)
app.post("/api/orders", getAllOrders)
app.post("/api/login", login)

app.post("/api/seed", seed)
app.post("/api/resetorders", resetOrders)
app.post("/api/seedusers", seedUsers)
app.post("/api/newuser", newUser)

app.post("/api/cart", checkoutClick)

app.listen(SERVER_PORT, () => {console.log(`Server started on port ${SERVER_PORT}`)})