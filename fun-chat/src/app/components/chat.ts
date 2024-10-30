import './chat.css';
import createElement from './create-element';
import SessionStorageManager from '../services/sessionstorage';
import createInfo from './info';

const sessionStorageManager = new SessionStorageManager();

export default function createChatElements() {
  const userData = sessionStorageManager.getUserData();
  const chatContainer = createElement('div', 'chat-container', document.body);
  const chatHeader = createElement('div', 'chat-header', chatContainer);

  createElement('h1', 'app-name', chatHeader, 'Fun Chat');
  createElement('h1', 'user-name', chatContainer, `${userData?.firstName}`);

  const buttonContainer = createElement('div', 'button-container', chatHeader);
  const infoButton = createElement('button', 'info-button', buttonContainer, 'info');
  createElement('button', 'logout-button', buttonContainer, 'logout');
  const usermessageContainer = createElement('div', 'main-chat-container', chatContainer);
  const usersContainer = createElement('div', 'users-container', usermessageContainer);
  createElement('input', 'users-search', usersContainer);
  createElement('div', 'users-list', usersContainer);
  const messageContainer = createElement('div', 'messages-container', usermessageContainer);
  const footer = createElement('div', 'footer', chatContainer);
  const school = createElement('a', 'footer-rss', footer, 'RSSchool');
  const github = createElement('a', 'footer-author', footer, 'angelinabz');

  school.setAttribute('href', 'https://rs.school/');
  github.setAttribute('href', 'https://github.com/AngelinaBz');

  createElement('label', 'footer-year', footer, '2024');
  const dialogueHeader = createElement('div', 'dialogue-header', messageContainer);
  createElement('p', 'dialogue-header__name', dialogueHeader);
  createElement('p', 'dialogue-header__status', dialogueHeader);
  createElement('div', 'dialogue-content', messageContainer, 'Please select the user...');
  const dialogueForm = createElement('form', 'dialogue-form', messageContainer);
  const dialogueMessage = createElement('input', 'dialogue-message', dialogueForm) as HTMLInputElement;
  const sendButton = createElement('button', 'dialogue-button', dialogueForm, 'Send') as HTMLButtonElement;
  sendButton.disabled = true;
  dialogueMessage.disabled = true;

  infoButton.addEventListener('click', (event) => {
    event.preventDefault();
    chatContainer.style.display = 'none';
    createInfo(chatContainer);
  });
}
