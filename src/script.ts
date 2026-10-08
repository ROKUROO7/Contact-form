const contactForm = document.getElementById("contact-form") as HTMLFormElement;
const queryInputs = document.getElementsByName("query-type");
const custom_Alert = document.getElementById("custom-alert") as HTMLElement;

type Input = {
  inputType: "text" | "text-area" | "radio" | "checkbox";
  htmlPath: HTMLInputElement | HTMLTextAreaElement;
  errorFieldPath: HTMLParagraphElement;
  radioContainer?: HTMLFieldSetElement;
  id?: string;
}

const firstName: Input = {
  inputType: "text", 
  htmlPath: document.getElementById('first-name') as HTMLInputElement,
  errorFieldPath: document.getElementById("first-name_required") as HTMLParagraphElement,
}

const lastName: Input = {
  inputType: "text",
  htmlPath: document.getElementById("last-name") as HTMLInputElement,
  errorFieldPath: document.getElementById("last-name_required") as HTMLParagraphElement,
}

const emailAddress: Input = {
  inputType: "text",
  htmlPath: document.getElementById("email") as HTMLInputElement,
  errorFieldPath: document.getElementById("email-required") as HTMLParagraphElement,
}

const queryInput: Input = {
  inputType: "radio",
  htmlPath: document.querySelector('input[name="query-type"]:checked') as HTMLInputElement,
  errorFieldPath: document.getElementById("query-required") as HTMLParagraphElement,
  radioContainer: document.getElementById("query-container") as HTMLFieldSetElement
}

const message: Input = {
  inputType: 'text-area',
  htmlPath: document.getElementById("message") as HTMLTextAreaElement,
  errorFieldPath: document.getElementById("message-required") as HTMLParagraphElement,
}

const consent: Input = {
  inputType: 'checkbox',
  htmlPath: document.getElementById("consent") as HTMLInputElement,
  errorFieldPath: document.getElementById("consent-required") as HTMLParagraphElement,
}

type Fields = {
  name: 'first name' | 'last name' | 'email' | 'query type' | 'message' | 'consent';
};

interface FieldInfo extends Fields {
  value: string | boolean;
}

interface FieldCheck extends FieldInfo {
  isValid: boolean;
  errorType?: 'required' | 'invalid'; 
};

function generateError(fieldType: FieldCheck): string {
  const fieldName = fieldType.name;
  const error = fieldType.errorType

  switch(fieldName) {
    case('first name'): 
      return error === 'required' ? "First Name is Required" : "Only Alphabets are Allowed";

    case('last name'): 
      return error === 'required' ?  "Last Name is Required" : "Only Alphabets are Allowed";

    case("email"): 
      return error === 'required' ? "Email is Required" : "Please Enter a Valid Email Address";

    case("query type"):
      return "Please select a query type";

    case("message"): 
      return "This field is required"

    case("consent"): 
      return "To submit this form, please consent to being contacted"
  }
}

function validateName(obj: FieldInfo): FieldCheck {
  const alphabets = /^[a-zA-Z]+$/g;
  const text = obj.value as string;

  if (!text) {
    return { name: obj.name, value: text, isValid: false,  errorType: "required" };
  } else if (!alphabets.test(text)) {
    return { name: obj.name, value: text, isValid: false,  errorType: "invalid" };
  } else {
    return { name: obj.name, value: text, isValid: true };
  }
}

function validateEmail(email: string): FieldCheck {
  const characters = /^[\w-\.]+@[\w-]+\.+[\w-]{2,4}$/g;

  if (!email) {
    return { name: "email", value: email, isValid: false,  errorType: "required" };
  } else if (!characters.test(email)) {
    return { name: "email", value: email, isValid: false,  errorType: "invalid" };
  } else {
    return { name: "email", value: email, isValid: true };
  }
}

function validateQueryType(querry: string): FieldCheck {
  if(!querry) {
    return { name: "query type", value: querry, isValid: false };
  } else {
    return { name: "query type", value: querry, isValid: true };
  }
}

function validateMsg(fieldText: string): FieldCheck  {
  if (!fieldText) {
    return { name: 'message', value: fieldText, isValid: false }
  } else {
    return { name: 'message', value: fieldText, isValid: true }
  }
}

function validateConsent(consent: boolean): FieldCheck {
  if (!consent) {
    return { name: "consent", value: consent, isValid: false }
  } else {
    return { name: "consent", value: consent, isValid: true }
  }
}

function resetQueryLabels(): void {
  if(queryInputs instanceof NodeList) {
    queryInputs.forEach((labels) => {
    const label = labels.closest(".form_label-query");

    if(label) label.classList.remove("form_label-query--active");
  })
  }
}

type FormFieldInfo = {
  paths: Input;
  info: FieldCheck;
}

contactForm.addEventListener("submit",(e) => {
  e.preventDefault()

  queryInput.htmlPath = document.querySelector('input[name="query-type"]:checked') as HTMLInputElement; // refreashing path to get most recent value

  const first_Name: FormFieldInfo = {
    paths: firstName,
    info: validateName({ name: 'first name', value: firstName.htmlPath.value})
  }
  const last_Name: FormFieldInfo = {
    paths: lastName,
    info: validateName({ name: 'last name', value: lastName.htmlPath.value  })
  }
  const email: FormFieldInfo = {
    paths: emailAddress,
    info: validateEmail(emailAddress.htmlPath.value)
  }
  const queryValue = queryInput.htmlPath ? queryInput.htmlPath.value : '';
  const query: FormFieldInfo = {
    paths: queryInput,
    info: validateQueryType(queryValue)
  }
  const msg: FormFieldInfo = {
    paths: message,
    info: validateMsg(message.htmlPath.value)
  }
  const consentChecked = (consent.htmlPath instanceof HTMLInputElement) ? consent.htmlPath.checked : false;
  const conSent: FormFieldInfo = {
    paths: consent,
    info: validateConsent(consentChecked)
  }

  const allFormFields: FormFieldInfo[] = [first_Name, last_Name, email, query, msg, conSent]

  let totalValidFields: number = 0;

  for(let formField of allFormFields) {

    const inputPath = formField.paths.htmlPath
    const errorPath = formField.paths.errorFieldPath

    if(formField.info.isValid) {
      errorPath.textContent = '';

      if(formField.paths.inputType === "text" || formField.paths.inputType === "text-area" ) {
        inputPath.classList.remove("form_input--red")
        inputPath.classList.add("form_input--green")
      }

      if(formField.paths.radioContainer) {
        formField.paths.radioContainer.setAttribute("aria-invalid","false")
      } else {
        inputPath.setAttribute("aria-invalid","false")
      }
      
      totalValidFields+= 1;

    } else {
      errorPath.textContent = generateError(formField.info)

      if(formField.paths.radioContainer) {
        formField.paths.radioContainer.setAttribute("aria-invalid","true")
      } else {
        inputPath.setAttribute("aria-invalid","true")
      }
      
      if(formField.paths.inputType === "text" || formField.paths.inputType === "text-area" ) {
        inputPath.classList.add("form_input--red")
      }
    }
  }

  if(totalValidFields === allFormFields.length) {
    contactForm.reset()
    resetQueryLabels()
    custom_Alert.classList.remove("custom-alert--inactive")
    setTimeout(()=> {
      custom_Alert.classList.add("custom-alert--inactive")
    },6000)
    totalValidFields = 0;
  }
});

const textInputs = [firstName, lastName, emailAddress, message]

textInputs.forEach((field) => {
  const input = field.htmlPath
  input.addEventListener("click",() => {
    input.classList.remove("form_input--red")
    input.setAttribute("aria-invalid","false")
    
    field.errorFieldPath.innerText = ""
  })
})

queryInputs.forEach((query) => {
  query.addEventListener("click",(e) => {
    const queryTarget = e.target as HTMLInputElement
    const queryContainer = queryTarget.closest('#query-container') as HTMLFieldSetElement
    
    resetQueryLabels()
    queryContainer.setAttribute("aria-invalid","false")
    const label = queryTarget.closest(".form_label-query") as HTMLLabelElement
    label.classList.add("form_label-query--active")
    queryInput.errorFieldPath.textContent = ''
  })
})

consent.htmlPath.addEventListener("click",() => {
  consent.htmlPath.setAttribute("aria-invalid","false")
  consent.errorFieldPath.textContent = ""
})