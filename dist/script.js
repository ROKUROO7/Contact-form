const contactForm = document.getElementById("contact-form");
const queryInputs = document.getElementsByName("query-type");
const custom_Alert = document.getElementById("custom-alert");
const firstName = {
    inputType: "text",
    htmlPath: document.getElementById('first-name'),
    errorFieldPath: document.getElementById("first-name_required"),
};
const lastName = {
    inputType: "text",
    htmlPath: document.getElementById("last-name"),
    errorFieldPath: document.getElementById("last-name_required"),
};
const emailAddress = {
    inputType: "text",
    htmlPath: document.getElementById("email"),
    errorFieldPath: document.getElementById("email-required"),
};
const queryInput = {
    inputType: "radio",
    htmlPath: document.querySelector('input[name="query-type"]:checked'),
    errorFieldPath: document.getElementById("query-required"),
    radioContainer: document.getElementById("query-container")
};
const message = {
    inputType: 'text-area',
    htmlPath: document.getElementById("message"),
    errorFieldPath: document.getElementById("message-required"),
};
const consent = {
    inputType: 'checkbox',
    htmlPath: document.getElementById("consent"),
    errorFieldPath: document.getElementById("consent-required"),
};
;
function generateError(fieldType) {
    const fieldName = fieldType.name;
    const error = fieldType.errorType;
    switch (fieldName) {
        case ('first name'):
            return error === 'required' ? "First Name is Required" : "Only Alphabets are Allowed";
        case ('last name'):
            return error === 'required' ? "Last Name is Required" : "Only Alphabets are Allowed";
        case ("email"):
            return error === 'required' ? "Email is Required" : "Please Enter a Valid Email Address";
        case ("query type"):
            return "Please select a query type";
        case ("message"):
            return "This field is required";
        case ("consent"):
            return "To submit this form, please consent to being contacted";
    }
}
function validateName(obj) {
    const alphabets = /^[a-zA-Z]+$/g;
    const text = obj.value;
    if (!text) {
        return { name: obj.name, value: text, isValid: false, errorType: "required" };
    }
    else if (!alphabets.test(text)) {
        return { name: obj.name, value: text, isValid: false, errorType: "invalid" };
    }
    else {
        return { name: obj.name, value: text, isValid: true };
    }
}
function validateEmail(email) {
    const characters = /^[\w-\.]+@[\w-]+\.+[\w-]{2,4}$/g;
    if (!email) {
        return { name: "email", value: email, isValid: false, errorType: "required" };
    }
    else if (!characters.test(email)) {
        return { name: "email", value: email, isValid: false, errorType: "invalid" };
    }
    else {
        return { name: "email", value: email, isValid: true };
    }
}
function validateQueryType(querry) {
    if (!querry) {
        return { name: "query type", value: querry, isValid: false };
    }
    else {
        return { name: "query type", value: querry, isValid: true };
    }
}
function validateMsg(fieldText) {
    if (!fieldText) {
        return { name: 'message', value: fieldText, isValid: false };
    }
    else {
        return { name: 'message', value: fieldText, isValid: true };
    }
}
function validateConsent(consent) {
    if (!consent) {
        return { name: "consent", value: consent, isValid: false };
    }
    else {
        return { name: "consent", value: consent, isValid: true };
    }
}
function resetQueryLabels() {
    if (queryInputs instanceof NodeList) {
        queryInputs.forEach((labels) => {
            const label = labels.closest(".form_label-query");
            if (label)
                label.classList.remove("form_label-query--active");
        });
    }
}
contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    queryInput.htmlPath = document.querySelector('input[name="query-type"]:checked'); // refreashing path to get most recent value
    const first_Name = {
        paths: firstName,
        info: validateName({ name: 'first name', value: firstName.htmlPath.value })
    };
    const last_Name = {
        paths: lastName,
        info: validateName({ name: 'last name', value: lastName.htmlPath.value })
    };
    const email = {
        paths: emailAddress,
        info: validateEmail(emailAddress.htmlPath.value)
    };
    const queryValue = queryInput.htmlPath ? queryInput.htmlPath.value : '';
    const query = {
        paths: queryInput,
        info: validateQueryType(queryValue)
    };
    const msg = {
        paths: message,
        info: validateMsg(message.htmlPath.value)
    };
    const consentChecked = (consent.htmlPath instanceof HTMLInputElement) ? consent.htmlPath.checked : false;
    const conSent = {
        paths: consent,
        info: validateConsent(consentChecked)
    };
    const allFormFields = [first_Name, last_Name, email, query, msg, conSent];
    let totalValidFields = 0;
    for (let formField of allFormFields) {
        const inputPath = formField.paths.htmlPath;
        const errorPath = formField.paths.errorFieldPath;
        if (formField.info.isValid) {
            errorPath.textContent = '';
            if (formField.paths.inputType === "text" || formField.paths.inputType === "text-area") {
                inputPath.classList.remove("form_input--red");
                inputPath.classList.add("form_input--green");
            }
            if (formField.paths.radioContainer) {
                formField.paths.radioContainer.setAttribute("aria-invalid", "false");
            }
            else {
                inputPath.setAttribute("aria-invalid", "false");
            }
            totalValidFields += 1;
        }
        else {
            errorPath.textContent = generateError(formField.info);
            if (formField.paths.radioContainer) {
                formField.paths.radioContainer.setAttribute("aria-invalid", "true");
            }
            else {
                inputPath.setAttribute("aria-invalid", "true");
            }
            if (formField.paths.inputType === "text" || formField.paths.inputType === "text-area") {
                inputPath.classList.add("form_input--red");
            }
        }
    }
    if (totalValidFields === allFormFields.length) {
        contactForm.reset();
        resetQueryLabels();
        custom_Alert.classList.remove("custom-alert--inactive");
        setTimeout(() => {
            custom_Alert.classList.add("custom-alert--inactive");
        }, 6000);
        totalValidFields = 0;
    }
});
const textInputs = [firstName, lastName, emailAddress, message];
textInputs.forEach((field) => {
    const input = field.htmlPath;
    input.addEventListener("click", () => {
        input.classList.remove("form_input--red");
        input.setAttribute("aria-invalid", "false");
        field.errorFieldPath.innerText = "";
    });
});
queryInputs.forEach((query) => {
    query.addEventListener("click", (e) => {
        const queryTarget = e.target;
        const queryContainer = queryTarget.closest('#query-container');
        resetQueryLabels();
        queryContainer.setAttribute("aria-invalid", "false");
        const label = queryTarget.closest(".form_label-query");
        label.classList.add("form_label-query--active");
        queryInput.errorFieldPath.textContent = '';
    });
});
consent.htmlPath.addEventListener("click", () => {
    consent.htmlPath.setAttribute("aria-invalid", "false");
    consent.errorFieldPath.textContent = "";
});
export {};
//# sourceMappingURL=script.js.map