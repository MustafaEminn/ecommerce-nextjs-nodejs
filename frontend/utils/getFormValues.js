export const getFormValues = (formId) => {
    let formElements = document.getElementById(formId).querySelectorAll("[name]");
    let newValues = {};
    for (var i = 0; formElements.length - 1 >= i; i++) {

        newValues[formElements[i]?.name] = formElements[i]?.value


    }
    return newValues;
};
