const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
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

    /** creat products */
    app.post("/inventory", async (req, res) => {
      const addedProduct = req.body;
      const result = await productCollection.insertOne(addedProduct);
      res.send(result);
    });

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
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const productsDetails = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { quantity: productsDetails.quantity },
      };
      const result = await productCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    /** delete products by id */
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    /** jwt token */
    app.post("/getjwt", async (req, res) => {
      const user = req.body;
      const secretToken = jwt.sign(user, process.env.JWT_TOKEN, {
        expiresIn: "5d",
      });
      res.send({ secretToken });
    });
  } finally {
    /** nothin to happen .*/
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("server e mutamuti vab ayce");
});

app.listen(port, () => {
  console.log(port, "listing");
});
