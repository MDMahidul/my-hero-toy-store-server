const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(express.json());
app.use(cors());
/* ------------------------- */
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0cmlqfw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db("myHero").collection("toys");

    //upload data to databse collection
    app.post("/upload", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await toyCollection.insertOne(data);
      res.send(result);
    });

    //see all the data from database
    app.get('/alltoys',async(req,res)=>{
        const result = await toyCollection.find().toArray();
        res.send(result)
    })
    //see individual data from database
    app.get('/details/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const result = await toyCollection.findOne(filter);
        res.send(result)
    })

    //get specific user data
    app.get('/mytoys/:email',async(req,res)=>{
        const filter = req.params.email;
        const result = await toyCollection.find({sellerEmail: filter}).toArray();
        res.send(result);
    })

    //update data
    app.put('/update/:id',async(req,res)=>{
        const id =req.params.id;
        const bodyData= req.body;
        const filter = {_id: new ObjectId(id)};
        const updateData = {
            $set:{
                price: bodyData.price,
                quantity: bodyData.quantity,
                description: bodyData.description
            }
        }
        const result = await toyCollection.updateOne(filter, updateData);
        res.send(result);
    })

    //delete specific single data 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

/* ------------------------- */
app.get('/',(req,res)=>{
    res.send('Hero Server is Running...')
});

app.listen(port,()=>{
    console.log(`hero server is running on: ${port}`);
})