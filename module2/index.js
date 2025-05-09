const express = require('express');
const cors = require('cors');
const port =process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())
// meheduvau
// qckkOQKshpQxxbAL


const uri = "mongodb+srv://meheduvau:qckkOQKshpQxxbAL@cluster0.wld9ndi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("users");

    app.get('/users', async(req,res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    app.post('/users',async(req,res)=>{
        const user =req.body;
        const result = await userCollection.insertOne(user);
        res.send(result)
        console.log(user)
    })

    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const updatedUser =req.body;
      console.log(updatedUser)

      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateNow = {
        $set:{
          name:updatedUser.name,
          email:updatedUser.email,
        }
      }
      const result = await userCollection.updateOne(filter, updateNow, options);
      res.send(result)
    })

    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hello there')
})

app.listen(port,()=>{
    console.log(port)
})