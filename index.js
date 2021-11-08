const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middelware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kreb2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //console.log('database connected');
        const database = client.db('mentalHealth');
        const therapysCollection = database.collection('therapys');

        //GET API
        app.get('/therapys', async (req, res) => {
            const cursor = therapysCollection.find({});
            const therapys = await cursor.toArray();
            res.send(therapys);
        })
        //GET SINGLE THERAPY
        app.get('/therapys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('Therapy is with id', id);
            const therapy = await therapysCollection.findOne(query);
            res.json(therapy);
        })
        //POST API
        app.post('/therapys', async (req, res) => {
            const therapy = req.body;
            console.log('hit the post api', therapy);


            const result = await therapysCollection.insertOne(therapy);
            console.log(result);
            res.json(result)
        })
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Mental Health Assignment');
});

app.listen(port, () => {
    console.log('Running on port', port);
})

//user
//mentalhealth
//password
//m2uCfqz2Raor1mLl