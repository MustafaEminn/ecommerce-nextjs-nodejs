export const resetFormValues = (formId) => {
  let formElements = document.getElementById(formId).querySelectorAll("[name]");
  for (var i = 0; formElements.length - 1 >= i; i++) {
    formElements[i].value = "";
  }
  return;
};
