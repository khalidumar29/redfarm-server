const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

/** middle ware */
app.use(cors());
app.use(express.json());

/** DB Connection */
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hkatx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const productCollection = client
      .db("inventor-products")
      .collection("inventorAllProducts");

    /** get all products */
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    /** get data using id  */
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productCollection.findOne(query);
      res.send(products);
    });
    /** update quantity */
    app.post("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const quantity = req.body;
      const query = { _id: ObjectId(id) };
      const update = await db.productCollection.updateOne(query, {
        $set: { quantity: quantity },
      });
      res.send(update);
    });
  } finally {
    /** nothin to happen */
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("server e mutamuti vab ayce");
});

app.listen(port, () => {
  console.log(port, "listing");
});
