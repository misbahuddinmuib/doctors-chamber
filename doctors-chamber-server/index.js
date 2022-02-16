const express = require('express')
const app = express()
const cors = require('cors'); // Cross-Origin Resource Sharing
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.igzrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const database = client.db("doctor_DB_chamber");
    const appointmentCollection = database.collection("appointmentsCollection");
    // perform actions on the collection object

    // get all the appointments based on the patient email address
    app.get('/appointments', (req, res) => {
        const email = req.query.email;
        const date = new Date(req.query.date).toDateString();
        const query = { patientEmail: email, date: date };
        console.log(date);
        appointmentCollection.find(query).toArray((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });

    // insert new appointment
    app.post('/appointments', (req, res) => {
        const appointment = req.body;
        const result = appointmentCollection.insertOne(appointment);
    });



    // client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World of Doctors Chamber!')
})

app.listen(port, () => {
    console.log(`${port}`)
})