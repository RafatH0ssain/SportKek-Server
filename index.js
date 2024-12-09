require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  MIDDLEWARE
// const corsOptions = {
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only specific methods
//     allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
// };
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.oyqb2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    tls: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

// function run() {
//     try {
// Connect the client to the server	(optional starting in v4.7)
// client.connect();
const db = client.db("SportKek");
const sportsCollection = db.collection("sports equipments");

app.get('/equipment', (req, res) => {
    sportsCollection.find().toArray()
        .then(result => res.send(result))
        .catch(error => {
            console.error("Error fetching equipment:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.get('/categories', (req, res) => {
    console.log("Attempting to fetch categories...");

    sportsCollection.distinct('categoryName')
        .then(categories => {
            if (!categories || categories.length === 0) {
                console.error("No categories found.");
                return res.status(404).json({ message: "No categories found" });
            }
            console.log("Retrieved categories:", categories);
            res.status(200).json(categories);
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Database query failed", error });
        });
});

app.get('/equipment/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    sportsCollection.findOne({ _id: new ObjectId(id) })
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No record found with that ID' });
            }
        })
        .catch(error => {
            console.error('Error fetching equipment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/addEquipment', (req, res) => {
    const newEquipment = req.body;

    sportsCollection.insertOne(newEquipment)
        .then(() => {
            res.status(201).json({ message: 'Equipment added successfully!' });
        })
        .catch(error => {
            console.error('Error adding equipment:', error);
            res.status(500).json({ error: 'Failed to save data' });
        });
});

app.post('/equipment', (req, res) => {
    const newEquipment = req.body;
    console.log(newEquipment);

    sportsCollection.insertOne(newEquipment)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.error('Error inserting equipment:', error);
            res.status(500).json({ error: 'Failed to insert equipment' });
        });
});

app.put('/equipment/:id', (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateEquipment = req.body;

    sportsCollection.updateOne(
        filter,
        {
            $set: {
                image: updateEquipment.image,
                itemName: updateEquipment.itemName,
                categoryName: updateEquipment.categoryName,
                description: updateEquipment.description,
                price: parseFloat(updateEquipment.price),
                rating: parseFloat(updateEquipment.rating),
                customization: updateEquipment.customization,
                processingTime: updateEquipment.processingTime,
                stockStatus: parseInt(updateEquipment.stockStatus),
            },
        }
    )
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Equipment not found" });
            }
            res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error updating equipment:', error);
            res.status(500).json({ message: 'Server error' });
        });
});


// Send a ping to confirm a successful connection
// client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } catch (err) {
//     console.error(err);
// } finally {
//     // Ensures that the client will close when you finish/error
//     // client.close();
// }
// }
// run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Sports Server is running')
})

app.listen(port, () => {
    console.log(`Sports server is running on PORT: ${port}`)
})