const contactForm = document.getElementById("contact-form")
const formInputA = Array.from(document.getElementsByClassName("form_input"))
const formInputB = {
  0 : document.getElementById("query-container"),
  1 : document.getElementById("consent")
}
const queryInput = document.getElementsByName("query-type")
const requiredGroupA = Array.from(document.getElementsByClassName("required-a"))
const requiredGroupB = Array.from(document.getElementsByClassName("required-b"))
const custom_Alert = document.getElementById("custom-alert")

function allundefined(obj) {
  const values = Object.values(obj)
  return values.every(value => value === undefined);
}
function validate(object) {
  if (!object) {
    return `This field is required`
  }
}
function validateName(name) {
  const alphabets = /^[a-zA-Z]+$/g
  if (!name) {
    return `This field is required`
  }
  else if (!alphabets.test(name)) {
    return `only alphabets are allowed`
  }
}
function validateEmail(email) {
  const characters = /^[\w-\.]+@[\w-]+\.+[\w-]{2,4}$/g
  if (!email) {
    return `This field is required`
  }
  else if (!characters.test(email)) {
    return `Please enter a valid email address`
  }
}
function validateQueryType(query) {
  if(!query) {
    return `Please select a query type`
  }
}
function validateConsent(consent) {
  if (!consent) {
    return `To submit this form, please consent to being contacted`
  }
}
function resetQueryLabels() {
  queryInput.forEach((labels) => {
    labels.closest(".form_label-query").classList.remove("form_label-query--active")
  })
}

contactForm.addEventListener("submit",(e) => {
  e.preventDefault()
  
  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData.entries())
  
  const errorGroupA = {
    0 : validateName(data["first-name"]),
    1 : validateName(data["last-name"]),
    2 : validateEmail(data["email"]),
    3 : validate(data["message"]),
  }
  const errorGroupB = {
    0 : validateQueryType(data["query-type"]),
    1 : validateConsent(data["consent"])
  }
  
  if (allundefined(errorGroupA) && allundefined(errorGroupB)) {
    contactForm.reset()
    resetQueryLabels()
    custom_Alert.classList.remove("custom-alert--inactive")
    setTimeout(()=> {
      custom_Alert.classList.add("custom-alert--inactive")
    },6000)
  }
  else {
    for (const key in errorGroupA) {
      if (errorGroupA[key]) {
        requiredGroupA[key].innerText = errorGroupA[key]
        formInputA[key].setAttribute("aria-invalid","true")
        formInputA[key].classList.add("form_input--red")
      }
      else {
        formInputA[key].classList.remove("form_input--red")
        formInputA[key].setAttribute("aria-invalid","false")
        formInputA[key].classList.add("form_input--green")
        requiredGroupA[key].innerText = ""
      }
    }
    for (const key in errorGroupB) {
      if (errorGroupB[key]) {
        requiredGroupB[key].innerText = errorGroupB[key]
        formInputB[key].setAttribute("aria-invalid","true")
      }
      else {
        formInputB[key].setAttribute("aria-invalid","false")
        requiredGroupB[key].innerText = ""
      }
    }
  }
})

formInputA.forEach((input) => {
  input.addEventListener("click",(e) => {
    e.target.classList.remove("form_input--red")
    e.target.setAttribute("aria-invalid","false")
    const errorText = e.target.nextElementSibling
    errorText.innerText = ""
  })
})

queryInput.forEach((query) => {
  query.addEventListener("click",(e) => {
    resetQueryLabels()
    formInputB[0].setAttribute("aria-invalid","false")
    const label = e.target.closest(".form_label-query")
    label.classList.add("form_label-query--active")
    requiredGroupB[0].innerText = ""
  })
})

formInputB[1].addEventListener("click",(e) => {
  e.target.setAttribute("aria-invalid","false")
  requiredGroupB[1].innerText = ""
})