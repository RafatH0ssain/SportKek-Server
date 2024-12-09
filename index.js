const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  MIDDLEWARE
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only specific methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.oyqb2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const db = client.db("SportKek");
        const sportsCollection = db.collection("sports equipments");

        // const sportsEquipment = [
        //     {
        //         image: "soccerball.jpg",
        //         itemName: "Soccer Ball",
        //         categoryName: "Ball",
        //         description: "A durable soccer ball suitable for all weather conditions.",
        //         price: 25,
        //         rating: 4.5,
        //         customization: "Extra durable stitching",
        //         processingTime: "3-5 business days",
        //         stockStatus: 50,
        //         userEmail: "user1@example.com",
        //         userName: "John Doe"
        //     },
        //     {
        //         image: "tennisracket.jpg",
        //         itemName: "Tennis Racket",
        //         categoryName: "Racket",
        //         description: "Lightweight and powerful tennis racket.",
        //         price: 75,
        //         rating: 4.7,
        //         customization: "Includes free grip tape",
        //         processingTime: "2-4 business days",
        //         stockStatus: 0,
        //         userEmail: "user2@example.com",
        //         userName: "Jane Smith"
        //     },
        //     {
        //         image: "basketball.jpg",
        //         itemName: "Basketball",
        //         categoryName: "Ball",
        //         description: "Official size and weight basketball for professional use.",
        //         price: 30,
        //         rating: 4.8,
        //         customization: "Text personalization available",
        //         processingTime: "1-3 business days",
        //         stockStatus: 30,
        //         userEmail: "user3@example.com",
        //         userName: "Sam Wilson"
        //     },
        //     {
        //         image: "baseballbat.jpg",
        //         itemName: "Baseball Bat",
        //         categoryName: "Bat",
        //         description: "Made from premium quality wood for a perfect swing.",
        //         price: 50,
        //         rating: 4.4,
        //         customization: "Custom grip options",
        //         processingTime: "4-6 business days",
        //         stockStatus: 20,
        //         userEmail: "user4@example.com",
        //         userName: "Alice Brown"
        //     },
        //     {
        //         image: "cricketbat.jpg",
        //         itemName: "Cricket Bat",
        //         categoryName: "Bat",
        //         description: "Perfect balance and powerful stroke cricket bat.",
        //         price: 60,
        //         rating: 4.6,
        //         customization: "Includes name engraving",
        //         processingTime: "5-7 business days",
        //         stockStatus: 15,
        //         userEmail: "user5@example.com",
        //         userName: "Michael Lee"
        //     },
        //     {
        //         image: "hockeystick.jpg",
        //         itemName: "Hockey Stick",
        //         categoryName: "Stick",
        //         description: "Lightweight stick for better control and power.",
        //         price: 45,
        //         rating: 4.3,
        //         customization: "Includes free stick tape",
        //         processingTime: "3-5 business days",
        //         stockStatus: 0,
        //         userEmail: "user6@example.com",
        //         userName: "Emma Green"
        //     },
        //     {
        //         image: "golfclubs.jpg",
        //         itemName: "Golf Clubs",
        //         categoryName: "Clubs",
        //         description: "Complete set of premium golf clubs.",
        //         price: 200,
        //         rating: 4.9,
        //         customization: "Personalized golf bag",
        //         processingTime: "6-8 business days",
        //         stockStatus: 10,
        //         userEmail: "user7@example.com",
        //         userName: "Olivia Johnson"
        //     },
        //     {
        //         image: "boxinggloves.jpg",
        //         itemName: "Boxing Gloves",
        //         categoryName: "Gloves",
        //         description: "Padded gloves for intense training sessions.",
        //         price: 40,
        //         rating: 4.5,
        //         customization: "Custom logo printing",
        //         processingTime: "2-3 business days",
        //         stockStatus: 25,
        //         userEmail: "user8@example.com",
        //         userName: "Ethan Davis"
        //     },
        //     {
        //         image: "skateboard.jpg",
        //         itemName: "Skateboard",
        //         categoryName: "Board",
        //         description: "Durable and smooth skateboard for all skill levels.",
        //         price: 70,
        //         rating: 4.7,
        //         customization: "Custom deck design",
        //         processingTime: "3-5 business days",
        //         stockStatus: 18,
        //         userEmail: "user9@example.com",
        //         userName: "Isabella Martinez"
        //     },
        //     {
        //         image: "tabletennispaddle.jpg",
        //         itemName: "Table Tennis Paddle",
        //         categoryName: "Paddle",
        //         description: "Ergonomic design for better control and spin.",
        //         price: 20,
        //         rating: 4.6,
        //         customization: "Name engraving",
        //         processingTime: "1-2 business days",
        //         stockStatus: 40,
        //         userEmail: "user10@example.com",
        //         userName: "Liam Taylor"
        //     }
        // ];
        // const result = await sportsCollection.insertMany(sportsEquipment);

        app.get('/equipment', async (req, res) => {
            const cursor = sportsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/categories', async (req, res) => {
            try {
                console.log("Attempting to fetch categories...");

                if (!sportsCollection) {
                    console.error("No sportsCollection defined.");
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                const categories = await sportsCollection.distinct('categoryName');
                console.log("Retrieved categories:", categories);

                if (!categories || categories.length === 0) {
                    console.error("No categories found.");
                    return res.status(404).json({ message: "No categories found" });
                }

                res.status(200).json(categories);
            } catch (error) {
                console.error("Error while querying database: ", error);
                res.status(500).json({ message: "Database query failed", error });
            }
        });


        app.get('/equipment/:id', async (req, res) => {
            try {
                const { id } = req.params; // Access the ID directly
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: 'Invalid ID format' });
                }

                const query = { _id: new ObjectId(id) };
                const result = await sportsCollection.findOne(query);

                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'No record found with that ID' });
                }
            } catch (error) {
                console.error('Error fetching equipment:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.post('/addEquipment', async (req, res) => {
            const { image, itemName, categoryName, description, price, rating, customization, processingTime, stockStatus, userEmail, userName } = req.body;
            try {
                const newEquipment = {
                    image,
                    itemName,
                    categoryName,
                    description,
                    price,
                    rating,
                    customization,
                    processingTime,
                    stockStatus,
                    userEmail,
                    userName,
                };
                await sportsCollection.insertOne(newEquipment);
                res.status(201).json({ message: 'Equipment added successfully!' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to save data' });
            }
        });


        app.post('/equipment', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await sportsCollection.insertOne(newCoffee);
            res.send(result);
        });

        app.put('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateEquipment = req.body;

            try {
                const result = await sportsCollection.updateOne(
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
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: "Equipment not found" });
                }

                res.status(200).json(result);
            } catch (error) {
                console.error('Error updating equipment:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Sports Server is running')
})

app.listen(port, () => {
    console.log(`Sports server is running on PORT: ${port}`)
})