const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/scheduling.html");
});


app.get("/api/animals", (req, res) => {
    res.send(animals);
});

app.post("/api/animals", upload.single("img"), (req, res) => {
    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const animal = {
        _id: animals.length + 1,
        name: req.body.name,
        color: req.body.color,
        size: req.body.size,
        located: req.body.located.split(","),
        diet: req.body.diet
    }

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    animals.push(animal);
    res.send(animals);
});

app.put("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);;

    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    animal.name = req.body.name;
    animal.color = req.body.color;
    animal.size = req.body.size;
    animal.located = req.body.located.split(",");;
    animal.diet = req.body.diet;

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    res.send(animal);
});

app.delete("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);

    if (!animal) {
        res.status(404).send("The animal was not found");
        return;
    }

    const index = animals.indexOf(animal);
    animals.splice(index, 1);
    res.send(animal);

});

const validateAnimal = (animal) => {
    const schema = Joi.object({
        _id: Joi.number().allow(''),
        name: Joi.string().allow(''),
        color: Joi.string().min(3).required(),
        size: Joi.string().min(3).required(),
        located: Joi.string().min(3).required(),
        diet: Joi.string().min(3).required()
    });

    return schema.validate(animal);
};

app.listen(3000, () => {
    console.log("I'm listening");
});