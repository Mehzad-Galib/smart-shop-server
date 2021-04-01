const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());

const pass = 'aCVjofJpW4auwNsc'

// body parser alternative
app.use(express.urlencoded({ extended:true }));
app.use(express.json());  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqgoj.mongodb.net/freshfood?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('db connected')
  const foodCollection = client.db("freshfood").collection("foods");
  const ordersCollection = client.db("freshfood").collection("orders");
 

   // for reading in the home page
  app.get('/foods', (req, res) => {
    foodCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.get('/checkout/:id', (req, res) => {
    foodCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, result)=>{
      res.send(result[0]);
    })
  })



  // creating data and send it to database, show on home page
  app.post("/addFood", (req, res) => {
    const newFood = req.body;
    foodCollection.insertOne(newFood)
    .then(result=> {
      res.send(result.insertCount > 0)
    }) 
  
  // deleting data from database and UI
  app.delete('/delete/:id', (req, res)=>{
    foodCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((err, result)=>{
      
    })
  })
    
    
  })

  app.post('/orderInfo', (req,res)=>{
    const newInfo = req.body;
    ordersCollection.insertOne(newInfo)
    .then(result=> {
      console.log(result);
      res.send(result.insertCount > 0)
    }) 
  })

  app.get('/purchase', (req, res)=>{
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

});




app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  
const port = 8080;
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 