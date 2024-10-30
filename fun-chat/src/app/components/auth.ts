import './auth.css';
import createElement from './create-element';

export default function createForm() {
  const form = createElement('form', 'form', document.body);
  createElement('h1', 'login', form, 'Login');
  const nameContainer = createElement('div', '', form);
  const passwordContainer = createElement('div', '', form);
  createElement('label', 'firstName-label', nameContainer, 'First Name');
  createElement('label', 'password-label', passwordContainer, 'Password');
  const firstName = createElement('input', 'firstname', nameContainer);
  firstName.setAttribute('type', 'text');
  const password = createElement('input', 'password', passwordContainer);
  password.setAttribute('type', 'password');
  const submitButton = createElement('button', 'submit', form, 'Login') as HTMLButtonElement;
  createElement('button', 'info', form, 'Info') as HTMLButtonElement;
  createElement('p', 'errorName', nameContainer);
  createElement('p', 'errorPassword', passwordContainer);

  submitButton.disabled = true;
}
createForm();

const firstName = document.querySelector('.firstname') as HTMLInputElement;
const password = document.querySelector('.password') as HTMLInputElement;
const submitButton = document.querySelector('.submit') as HTMLButtonElement;
const errorName = document.querySelector('.errorName') as HTMLParagraphElement;
const errorPassword = document.querySelector('.errorPassword') as HTMLParagraphElement;

function checkNameValidity(inputField: HTMLInputElement, errorField: HTMLParagraphElement) {
  const value = inputField.value.trim();
  const newerrorField = errorField;
  let errorMessage: string[] = [];
  if (!/^[a-zA-Z\\-]+$/.test(value)) {
    errorMessage.push('Invalid characters');
  }
  if (inputField === firstName) {
    if (!/^[A-Z]/.test(value)) {
      errorMessage.push('First letter should be uppercase');
    }
  }
  if (inputField === password) {
    if (value.length < 4) {
      errorMessage.push('Must be at least 4 characters');
    }
  }
  if (value === '') {
    errorMessage = [];
  }
  newerrorField.textContent = errorMessage.join('. ');
  return errorMessage.length === 0;
}

function checkFormValidity() {
  if (document.activeElement === firstName) {
    checkNameValidity(firstName, errorName);
  } else if (document.activeElement === password) {
    checkNameValidity(password, errorPassword);
  }
  const isValidName = errorName.textContent === '' && errorPassword.textContent === '';
  const isEmptyInput = firstName.value.trim() !== '' && password.value.trim() !== '';
  submitButton.disabled = !(isValidName && isEmptyInput);
}

firstName.addEventListener('input', checkFormValidity);
password.addEventListener('input', checkFormValidity);
