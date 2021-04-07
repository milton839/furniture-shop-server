const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const port = process.env.PORT || 5000;

const app = express()
app.use(cors());
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cf5ms.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ProductsCollection = client.db("furnitureShopStore").collection("furnitureProducts");
  const ordersCollection = client.db("furnitureShopStore").collection("orders");
  
    app.post('/addProducts',(req,res) => {
        const products = req.body;
        ProductsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder',(req,res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

    app.get('/products',(req,res) => {
      ProductsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    //==================Get from orders product=======================
    app.get('/ordersProduct',(req,res) => {
      ordersCollection.find({email:req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })


    app.delete('/deleteProduct/:id',(req,res) => {
      const id = ObjectID(req.params.id);
      // console.log('Deleted id', id);
      ProductsCollection.findOneAndDelete({_id:id})
      .then(result => {
        res.send(result.value)
        
      })
    })


//   client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})