const express = require('express');
const mongoose = require('mongoose');
const route = require("./routes/authorizations.route")
const port = 3030

const app = express();
app.use(express.json())

app.use('/auth', route)

const start =  () => {
    try {
        app.listen(port, () => {
            console.log('Server is working...')

            mongoose
            .connect(
              "mongodb+srv://User:User_123@cluster0.vw2rp2n.mongodb.net/authorization?retryWrites=true&w=majority"
            )
            .then(() => console.log("Успешно соединились с сервером MongoDB"))
            .catch(() => console.log("Ошибка при соединении с сервером MongoDB"));
        });
    } catch (error) {
        console.log(error)
    }
}

start()