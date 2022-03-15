const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const sanitizeHTML = require("sanitize-html");

const app = express();
let db;
const PORT = process.env.PORT || 3000;

const uri = "Enter your mongodb uri here";

async function connection() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
}

connection();

app.use(express.static("public"));
app.use(express.json());

// Get Items
app.get("/", (req, res) => {
  db.collection("items")
    .find()
    .toArray((err, items) => {
      res.status(200).send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Todo Practice</title>
      <!-- Bootstrap 5 -->
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">Todo App</h1>
        <form id="form-field" class="mb-3 shadow-sm p-3 mb-5 rounded bg-light bg-gradient">
          <div class="d-flex align-items-center">
            <input
              type="text"
              class="autofocus flex-grow-1 me-4 form-control"
              id="create-field"
              autocomplete="off"
            />
            <button class="btn btn-primary flex-shrink-0">Add New Item</button>
          </div>
        </form>
        <ul class="list-group" id="item-list"></ul>
      </div>
  
      <!-- scripts -->
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script>
        const items = ${JSON.stringify(items)}
      </script>
      <script src="./browser.js"></script>
    </body>
  </html>
  `);
    });
});

// Create Item
app.post("/create-item", (req, res) => {
  const safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  db.collection("items").insertOne({ text: safeText }, (err, info) => {
    if (err) return;
    res.json({ _id: info.insertedId, text: safeText });
  });
});

// Update Item
app.post("/update-item", (req, res) => {
  const safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  db.collection("items").updateOne(
    { _id: new ObjectId(req.body.id) },
    { $set: { text: safeText } },
    (err, info) => {
      res.json({ text: safeText });
    }
  );
});

// Delete Item
app.post("/delete-item", (req, res) => {
  db.collection("items").deleteOne(
    { _id: new ObjectId(req.body.id) },
    (err, info) => {
      res.json({ message: "ok" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} ...`);
});
