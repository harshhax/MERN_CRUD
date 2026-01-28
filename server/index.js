// import the libraries - express - mongoose - cors
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create express server
const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err))

// create a model
const Person = mongoose.model("Person", {name: String, age:Number}, "person");

// read all the people
app.get("/", async(req,res) => {
    const people = await Person.find();
    res.json(people);
});

// add new people
app.post("/", async(req,res) => {
    const newPerson = await Person.create(req.body);
    res.json(newPerson);
})

// update people
app.put("/:id", async(req, res) => {
    const updated = await Person.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.json(updated);
});

// delete people
app.delete("/:id", async(req,res) =>{
    await Person.findByIdAndDelete(req.params.id);
    res.json({message: "person deleted"});
});

//connection
const PORT = process.env.PORT || 4000;
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
})