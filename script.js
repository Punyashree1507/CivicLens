const photo = document.getElementById("photo");
const preview = document.getElementById("preview");
const form = document.getElementById("reportForm");

let selectedImage = "";

photo.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        selectedImage = event.target.result;
        preview.innerHTML = `<img src="${selectedImage}" alt="Issue preview"><p>Photo selected successfully</p>`;
    };

    reader.readAsDataURL(file);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    if (!selectedImage) {
        alert("Please upload an issue photo.");
        return;
    }

    const report = document.createElement("div");
    report.className = "report-card";

    const image = document.createElement("img");
    image.src = selectedImage;
    image.alt = "Civic issue";

    const title = document.createElement("h3");
    title.textContent = category;

    const place = document.createElement("p");
    place.textContent = "📍 " + location;

    const details = document.createElement("p");
    details.textContent = description;

    const status = document.createElement("p");
    status.textContent = "Status: Submitted (Demo)";

    report.append(image, title, place, details, status);

    const reports = document.getElementById("reports");

    if (reports.querySelector("p")) {
        reports.innerHTML = "";
    }

    reports.prepend(report);

    const total = document.getElementById("total");
    total.textContent = Number(total.textContent) + 1;

    document.getElementById("message").textContent =
        "Your demo report has been submitted successfully!";

    form.reset();
    selectedImage = "";
    preview.innerHTML = "📷<p>Click to upload an image</p><small>PNG, JPG or JPEG</small>";
});