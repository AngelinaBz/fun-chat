import SessionStorageManager from '../services/sessionstorage';
import { ws } from '../services/websocket';
import createInfo from '../components/info';

const firstName = document.querySelector('.firstname') as HTMLInputElement;
const password = document.querySelector('.password') as HTMLInputElement;
const submitButton = document.querySelector('.submit') as HTMLButtonElement;
const infoButton = document.querySelector('.info') as HTMLButtonElement;
const form = document.querySelector('.form') as HTMLElement;

const sessionStorageManager = new SessionStorageManager();

export default function goToChat() {
  const userData = sessionStorageManager.getUserData();
  const message = {
    id: String(Date.now()),
    type: 'USER_LOGIN',
    payload: {
      user: {
        login: userData?.firstName,
        password: userData?.password,
      },
    },
  };
  ws.send(JSON.stringify(message));
}

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const firstNameValue = firstName.value;
  const passwordValue = password.value;
  sessionStorageManager.saveUserData(firstNameValue, passwordValue);
  goToChat();
});

form.addEventListener('submit', (event) => {
  if (submitButton.disabled === false) {
    event.preventDefault();
    const firstNameValue = firstName.value;
    const passwordValue = password.value;
    sessionStorageManager.saveUserData(firstNameValue, passwordValue);
    goToChat();
  }
});

infoButton.addEventListener('click', (event) => {
  event.preventDefault();
  form.style.display = 'none';
  createInfo(form);
});
