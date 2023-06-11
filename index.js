// SUgZZmrFmH5RLcf8
// mystylinlife223
const express= require('express')
const cors= require('cors')

const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port= process.env.PORT || 5000  
require('dotenv').config()

app.use(cors())
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(express.json())


// const verifyJWT = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return res.status(401).send({ error: true, message: 'unauthorized access' });
//   }
//   // bearer token
//   const token = authorization.split(' ')[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ error: true, message: 'unauthorized access' })
//     }
//     req.decoded = decoded;
//     next();
//   })
// }




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xqymst.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://mystylinlife223:<password>@cluster0.0xqymst.mongodb.net/?retryWrites=true&w=majority";

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
    const db=client.db("musicClass");
    const favouriteClass=db.collection("carts") //favourite class

    const studentsCollection=db.collection("allStudents") //all user
    const classCollection=db.collection("classes") // all class


    // app.post('/jwt', (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

    //   res.send({ token })
    // })

    app.get('/studentProfile/admin/:email',  async (req, res) => {
      const email = req.params.email;

      const query = { email: email }
      const user = await studentsCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result);
    })





    app.post("/postfav",async(req,res)=>{
        const body=req.body
        const result=await favouriteClass.insertOne(body)
        res.send(result)

        
        console.log(body)
    })

    app.patch('/studentProfile/admin/:id', async (req,res)=>{
      const id=req.params.id;
      const filteradmin={_id: new ObjectId(id)};
      const updateDoc={
        $set :{
          role :'admin'
        },

      }
      const result =await studentsCollection.updateOne(filteradmin,updateDoc)
      res.send(result)
    })

    






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('coffe makign')
})

app.listen(port,()=>{
    console.log(`coffee server is running on port ${port}`)
})