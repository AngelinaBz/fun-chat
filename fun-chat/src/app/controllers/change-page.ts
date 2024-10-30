import SessionStorageManager from '../services/sessionstorage';
//  import createChat from '../components/chat';
import { ws } from '../services/websocket';
import goToChat from './auth-controller';

const form = document.querySelector('.form') as HTMLElement;

const sessionStorageManager = new SessionStorageManager();
const userData = sessionStorageManager.getUserData();

ws.addEventListener('open', () => {
  console.log('ready');
  if (userData) {
    form.style.display = 'none';
    goToChat();
  } else {
    form.style.display = 'flex';
  }
});
