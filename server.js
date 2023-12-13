const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const appointments = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/scheduling.html");
});

app.get("/api/appointments", (req, res) => {
    res.send(appointments);
});

app.post("/api/schedule-appointment", (req, res) => {
    const { type, time } = req.body;

    if (!type || !time) {
        return res.status(400).send("Type and time are required.");
    }

    const appointment = {
        _id: appointments.length + 1,
        type: type,
        time: time,
    };

    appointments.push(appointment);
    res.json(appointments);
});


app.put("/api/edit-appointment/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { type, time } = req.body;

    if (appointment && type && time) {
        appointment.type = type;
        appointment.time = time;
        res.json(appointment);
    } else {
        res.status(400).send("Invalid input or appointment not found.");
    }
});

app.delete("/api/delete-appointment/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const appointmentIndex = appointments.findIndex((a) => a._id === id);

    if (appointmentIndex !== -1) {
        const deletedAppointment = appointments.splice(appointmentIndex, 1);
        res.json(deletedAppointment[0]);
    } else {
        res.status(404).send("Appointment not found.");
    }
});



app.listen(3000, () => {
    console.log("I'm live");
});
