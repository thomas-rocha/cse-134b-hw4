
const form = document.querySelector("#form-with-js form");

form.noValidate = true;

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const commentsInput = document.getElementById("comments");

const fields = [nameInput, emailInput, commentsInput];

const formErrors = document.getElementById("form-errors");

const infoArea = document.createElement("p");
infoArea.id = "info-area";
commentsInput.after(infoArea);

const errorHistoryField = document.getElementById("form-errors-history");

const edited = new Set();

const form_errors = [];
let currentAttemptFields = null;


function getErrorMessage(field) {
    const validity = field.validity;
    if (validity.valueMissing) {
        return "This field is required.";
    }
    if (validity.typeMismatch) {
        return "Please enter a valid email address.";
    }
    if (validity.tooShort) {
        return `Please enter at least ${field.minLength} characters.`;
    }
    return "";
}

function recordError(field) {
    if (!currentAttemptFields || currentAttemptFields.has(field)) {
        return;
    }
    currentAttemptFields.add(field);
    form_errors.push({
        field: field.name,
        error: field.validationMessage
    });
}

function showFieldError(field, message) {
    const errorId = `${field.id}-error`;
    let errorElement = document.getElementById(errorId);

    if (!message) {
        if (errorElement) {
            errorElement.remove();
        }
        return;
    }

    if (!errorElement) {
        errorElement = document.createElement("p");
        errorElement.id = errorId;
        formErrors.append(errorElement);
    }
    const label = field.labels[0].textContent.replace(":", "").trim();
    const text = `${label}: ${message}`;
    if (errorElement.textContent !== text) {
        errorElement.textContent = text;
    }
}


function validateField(field) {
    field.setCustomValidity("");
    const message = getErrorMessage(field);
    field.setCustomValidity(message);
    showFieldError(field, message);
    field.setAttribute(
        "aria-invalid",
        String(!field.validity.valid)
    );
    return field.validity.valid;
}


function updateCommentsInfo() {
    const remaining =
        commentsInput.maxLength - commentsInput.value.length;
    const nearLimit = remaining <= 50;
    let message;
    if (remaining <= 0) {
        message = "Maximum characters reached.";
    }
    else if (nearLimit) {
        message = `${remaining} characters remaining.`;
    }
    else {
        message =
            `${commentsInput.value.length}/${commentsInput.maxLength} characters used.`;
    }
    infoArea.textContent = message;
    infoArea.classList.toggle("italics", nearLimit);
}


// Handle field events
fields.forEach(field => {
    field.addEventListener("input", () => {

        edited.add(field);
        if (field === commentsInput) {
            updateCommentsInfo();
        }
        // Once an error is showing, update it as the user types so a
        // stale custom message never blocks a corrected field
        if (field.getAttribute("aria-invalid") === "true") {
            validateField(field);
        }
    });
    field.addEventListener("blur", () => {
        if (edited.has(field)) {
            validateField(field);
        }
    });
});


form.addEventListener("invalid", (event) => {
    recordError(event.target);
}, true);


form.addEventListener("submit", (event) => {
    fields.forEach(validateField);

    currentAttemptFields = new Set();
    const formIsValid = form.checkValidity();
    currentAttemptFields = null;

    if (!formIsValid) {
        event.preventDefault();
    } else {
        errorHistoryField.value = JSON.stringify(form_errors);
    }
});

// Clicking the error area moves focus to the first invalid field
formErrors.addEventListener("click", () => {
    const firstInvalid = fields.find(
        field => field.getAttribute("aria-invalid") === "true"
    );
    if (firstInvalid) {
        firstInvalid.focus();
    }
});

updateCommentsInfo();
