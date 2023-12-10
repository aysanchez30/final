const getAppointments = async () => {
    try {
        return (await fetch("/api/appointments")).json();
    } catch (error) {
        console.error(error);
    }
};

const showAppointments = async () => {
    let appointments = await getAppointments();
    let appointmentsDiv = document.getElementById("appointments-list");
    appointmentsDiv.innerHTML = "";
    appointments.forEach((appointment) => {
        const section = document.createElement("section");
        section.classList.add("appointment");
        appointmentsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = appointment.name;
        a.append(h3);

        // ... (existing code)

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(appointment);
        };
    });
};

const displayDetails = (appointment) => {
    const appointmentDetails = document.getElementById("appointments-details");
    appointmentDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = " &#x2715;";
    appointmentDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    appointmentDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = `<strong>Name: </strong> ${appointment.name}`;
    appointmentDetails.append(h3);

    const time = document.createElement("p");
    time.innerHTML = `<strong>Time: </strong> ${appointment.time}`;
    appointmentDetails.append(time);

    const type = document.createElement("p");
    type.innerHTML = `<strong>Appointment Type: </strong> <a href="${appointment.type}" target="_blank">Download</a>`;
    appointmentDetails.append(type);

    // ... (existing code)

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("title").innerHTML = "Edit Appointment";
        populateEditForm(appointment);
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteAppointment(appointment);
    };
};

const deleteAppointment = async (appointment) => {
    let response = await fetch(`/api/appointments/${appointment._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });

    if (response.status !== 200) {
        console.log("Error deleting appointment");
        return;
    }

    let result = await response.json();
    showAppointments();
    document.getElementById("appointments-details").innerHTML = "";
    resetForm();
};

const populateEditForm = (appointment) => {
    const form = document.getElementById("add-edit-appointment-form");
    form._id.value = appointment._id;
    form.name.value = appointment.name;
    form.time.value = appointment.time;
    // ... (other fields)

    // Clear the file input
    form.type.value = "";
};

const addEditAppointment = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-appointment-form");
    const formData = new FormData(form);

    let appointment;
    if (form._id.value === "-1") {
        formData.delete("_id");

        response = await fetch("/api/appointments", {
            method: "POST",
            body: formData,
        });
    } else {
        response = await fetch(`/api/appointments/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
    }

    if (response.status !== 200) {
        console.log("Error posting");
    }

    appointment = await response.json();

    if (form._id.value !== "-1") {
        displayDetails(appointment);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showAppointments();
};

const resetForm = () => {
    const form = document.getElementById("add-edit-appointment-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("title").innerHTML = "Add Appointment";
    resetForm();
};

window.onload = () => {
    showAppointments();
    document.getElementById("add-edit-appointment-form").onsubmit = addEditAppointment;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
};
