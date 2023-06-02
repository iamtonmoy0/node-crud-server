const express=require('express');
const cors =require('cors');
const app=express();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const port= 5000;
//middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://:@cluster0.hh2vhtl.mongodb.net/?retryWrites=true&w=majority";

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

    const userCollection = client.db("userDB").collection('users');
   
   //get all users
    app.get('/users',async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
    })

    //get user by specific id
    app.get('/update/:id',async(req,res)=>{
        const id =req.params.id;
        const query = {_id:new ObjectId(id)}
        const user = await userCollection.findOne(query);
        res.send(user)

    })
    //update user ........
    app.put('/update/:id' ,async(req,res)=>{
      const id =req.params.id;
      const  updateData = req.body;
       
      const filter = {_id: new ObjectId(id)}
      const options ={upsert:true} //if this id exist then it will change or it will update
      const updateUser={
        $set:{
          name:updateData.name,
          email:updateData.email
        }
      }
      const result = await userCollection.updateOne(filter,updateUser,options)
      
      res.send(result)


    })
    //post user data to db/create user
    app.post('/users', async(req,res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user);
      res.send(result);
  });
    //delete user
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result) 

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//get

app.get('/',(req,res)=>{
	res.send('server is running!')
})



app.listen(port)