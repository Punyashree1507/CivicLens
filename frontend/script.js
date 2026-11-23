const form = document.getElementById("reportForm");
const message = document.getElementById("message");
const reportsList = document.getElementById("reportsList");

const API = "/api/reports";


form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "category",
        document.getElementById("category").value
    );

    formData.append(
        "location",
        document.getElementById("location").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "photo",
        document.getElementById("photo").files[0]
    );

    message.textContent = "Submitting...";

    try {

        const response = await fetch(API, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Submission failed");
        }

        message.textContent = result.message;
        message.style.color = "green";

        form.reset();

        loadReports();

    } catch (error) {

        message.textContent = error.message;
        message.style.color = "red";

    }

});


async function loadReports() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Could not load reports");
        }

        const reports = await response.json();

        reportsList.innerHTML = "";

        if (reports.length === 0) {
            reportsList.textContent = "No reports submitted yet.";
            return;
        }

        reports.forEach(report => {

            const card = document.createElement("div");
            card.className = "report-card";

            const title = document.createElement("h3");
            title.textContent = report.category;

            const location = document.createElement("p");
            location.textContent = "Location: " + report.location;

            const description = document.createElement("p");
            description.textContent =
                "Description: " + report.description;

            const status = document.createElement("p");
            status.textContent = "Status: " + report.status;

            const image = document.createElement("img");
            image.src = report.photo_url;
            image.alt = "Complaint photo";

            card.append(title, location, description, status, image);
            reportsList.appendChild(card);

        });

    } catch (error) {

        reportsList.textContent = error.message;

    }

}

loadReports();