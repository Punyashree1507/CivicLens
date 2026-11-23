const form = document.getElementById("reportForm");
const message = document.getElementById("message");
const reportsList = document.getElementById("reportsList");

const API = "/api/reports";

// Submit complaint
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("category", document.getElementById("category").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("description", document.getElementById("description").value);

    const photo = document.getElementById("photo").files[0];

    if (!photo) {
        message.textContent = "Please select a photo";
        message.style.color = "red";
        return;
    }

    formData.append("photo", photo);

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


// Load all complaints
async function loadReports() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Could not load reports");
        }

        const reports = await response.json();
        document.getElementById("totalCount").textContent = reports.length;

const resolved = reports.filter(
    report => report.status.toLowerCase() === "resolved"
).length;

document.getElementById("resolvedCount").textContent = resolved;

document.getElementById("pendingCount").textContent =
    reports.length - resolved;

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
            description.textContent = "Description: " + report.description;

            const status = document.createElement("p");
            status.textContent = "Status: " + report.status;

            // Display uploaded image
            const image = document.createElement("img");

            image.src = "/uploads/" + encodeURIComponent(report.image);
            image.alt = "Complaint photo";
            image.style.width = "250px";
            image.style.height = "180px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "10px";

            image.onerror = function() {
                image.alt = "Image could not be loaded";
            };

            const statusSelect = document.createElement("select");

["Pending", "In Progress", "Resolved"].forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;

    if (report.status === value) {
        option.selected = true;
    }

    statusSelect.appendChild(option);
});

statusSelect.addEventListener("change", async function() {
    try {
        const response = await fetch(
            `/api/reports/${report.id}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: statusSelect.value
                })
            }
        );

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        loadReports();

    } catch (error) {
        alert(error.message);
    }
});

card.append(title, location, description, status, image, statusSelect);

            reportsList.appendChild(card);
        });

    } catch (error) {
        reportsList.textContent = error.message;
    }
}


// Load reports when website opens
loadReports();