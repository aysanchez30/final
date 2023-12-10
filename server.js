const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));

app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");



mongoose
    .connect("mongodb+srv://as155:dMusmnoNZyFIi78@csce242.2fpokqq.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("could not connect to mongodb...", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/scheduling.html");
});

const appointmentSchema = new mongoose.Schema({
    name: String,
    time: String,
});

app.post("/api/appointments", upload.single("type"), (req, res) => {
    console.log("Received POST request to /api/appointments");
    const result = validateAppointment(req.body);

    if (result.error) {
        console.log("Validation error:", result.error.details[0].message);
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log("Validated input:", req.body);

    const newAppointment = new Appointment({
        name: req.body.name,
        time: req.body.time
    });

    createAppointment(newAppointment, res);
});

app.put("/api/appointments/:id", upload.single("type"), (req, res) => {
    console.log(`Received PUT request to /api/appointments/${req.params.id}`);
    const result = validateAppointment(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateAppointment(req, res);
});
const validateAppointment = (appointment) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        time: Joi.string().min(3).required(),
       
    });
    console.log("Validating appointment:", appointment);
    return schema.validate(appointment);
};

app.listen(3000, () => {
    console.log("I'm Listening");
});