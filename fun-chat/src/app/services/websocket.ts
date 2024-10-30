import SessionStorageManager from './sessionstorage';
import createElement from '../components/create-element';
import { User, UserLogin, Message } from '../interface';
import updateDialogue from '../controllers/update-dialogue';
import createChatElements from '../components/chat';
import userSearch from '../controllers/search-users';

const modalText = document.querySelector('.modal-text') as HTMLElement;
const modal = document.querySelector('.modal') as HTMLElement;
const modalButton = document.querySelector('.modal-button') as HTMLElement;
const sessionStorageManager = new SessionStorageManager();
const form = document.querySelector('.form') as HTMLElement;

export const ws = new WebSocket('ws://localhost:4000');

let confirmationDialogVisible = false;

export function createChat() {
  createChatElements();
  const usersSearch = document.querySelector('.users-search') as HTMLElement;
  const logout = document.querySelector('.logout-button') as HTMLElement;
  const chatContainer = document.querySelector('.chat-container') as HTMLElement;
  const sendButton = document.querySelector('.dialogue-button') as HTMLButtonElement;
  const dialogueMessage = document.querySelector('.dialogue-message') as HTMLInputElement;
  const dialogueName = document.querySelector('.dialogue-header__name') as HTMLElement;
  const messageAuthenticated = {
    id: String(Date.now()),
    type: 'USER_ACTIVE',
    payload: null,
  };
  ws.send(JSON.stringify(messageAuthenticated));
  const messageUnauthorized = {
    id: String(Date.now()),
    type: 'USER_INACTIVE',
    payload: null,
  };
  ws.send(JSON.stringify(messageUnauthorized));
  logout.addEventListener('click', () => {
    const userData = sessionStorageManager.getUserData();
    const messageLogout = {
      id: String(Date.now()),
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login: userData?.firstName,
          password: userData?.password,
        },
      },
    };
    ws.send(JSON.stringify(messageLogout));
    sessionStorage.removeItem('userData');
    form.style.display = 'flex';
    chatContainer.remove();
  });
  usersSearch.addEventListener('input', userSearch);
  dialogueMessage.addEventListener('input', () => {
    if (dialogueMessage.value.trim() !== '') {
      sendButton.disabled = false;
    } else {
      sendButton.disabled = true;
    }
  });
  sendButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (dialogueMessage.value !== '') {
      if (sendButton.textContent === 'Send') {
        const message = {
          id: String(Date.now()),
          type: 'MSG_SEND',
          payload: {
            message: {
              to: dialogueName.textContent,
              text: dialogueMessage.value,
            },
          },
        };
        ws.send(JSON.stringify(message));
        dialogueMessage.value = '';
        sendButton.disabled = true;
      }
    }
    if (sendButton.textContent === 'Edit') {
      const currentMessageId = sessionStorage.getItem('edit-id');
      const messageEdit = {
        id: String(Date.now()),
        type: 'MSG_EDIT',
        payload: {
          message: {
            id: currentMessageId,
            text: dialogueMessage.value,
          },
        },
      };
      ws.send(JSON.stringify(messageEdit));
      dialogueMessage.value = '';
      sendButton.textContent = 'Send';
      confirmationDialogVisible = false;
      const editCancel = document.querySelector('.edit-cancel') as HTMLElement;
      editCancel.remove();
    }
  });
}

function createNewActiveUser(user: UserLogin) {
  const usersContainer = document.querySelector('.users-list') as HTMLElement;
  const userBlock = createElement('div', 'user', usersContainer);
  const status = createElement('span', 'user-status', userBlock);
  status.style.backgroundColor = '#4cac1f';
  createElement('p', 'user-login', userBlock, `${user.login}`);
  createElement('span', 'new-message', userBlock);
  const messageAll = {
    id: String(Date.now()),
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login: user.login,
      },
    },
  };
  ws.send(JSON.stringify(messageAll));
  userBlock.addEventListener('click', () => {
    ws.send(JSON.stringify(messageAll));
  });
}

function createNewInactiveUser(user: UserLogin) {
  const usersContainer = document.querySelector('.users-list') as HTMLElement;
  const userBlock = createElement('div', 'user', usersContainer);
  const status = createElement('span', 'user-status', userBlock);
  createElement('p', 'user-login', userBlock, `${user.login}`);
  status.style.backgroundColor = '#494a45a0';
  createElement('span', 'new-message', userBlock);
  const messageAll = {
    id: String(Date.now()),
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login: user.login,
      },
    },
  };
  ws.send(JSON.stringify(messageAll));
  userBlock.addEventListener('click', () => {
    ws.send(JSON.stringify(messageAll));
  });
}

function deleteMessage(idMessage: string) {
  const message = {
    id: String(Date.now()),
    type: 'MSG_DELETE',
    payload: {
      message: {
        id: idMessage,
      },
    },
  };
  ws.send(JSON.stringify(message));
}

function createConfirmationDialog(message: Message, block: HTMLElement) {
  const confirmationDialog = createElement('div', 'confirmation-dialog', block);
  const cancelButton = createElement('div', 'confirmation-cancel', confirmationDialog);
  const deleteButton = createElement('button', 'confirmation-delete', confirmationDialog, 'Delete');
  const editButton = createElement('button', 'confirmation-edit', confirmationDialog, 'Edit');
  const sendButton = document.querySelector('.dialogue-button') as HTMLButtonElement;
  const dialogueMessage = document.querySelector('.dialogue-message') as HTMLInputElement;
  const dialogueForm = document.querySelector('.dialogue-form') as HTMLElement;
  const messageText = block.querySelector('.message-text') as HTMLElement;

  cancelButton.addEventListener('click', (event) => {
    event.stopPropagation();
    confirmationDialogVisible = false;
    confirmationDialog.remove();
  });

  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteMessage(message.id);
    confirmationDialogVisible = false;
    confirmationDialog.remove();
  });

  editButton.addEventListener('click', (event) => {
    console.log(message);
    event.stopPropagation();
    dialogueMessage.value = messageText?.textContent ?? '';
    confirmationDialog.remove();
    sendButton.textContent = 'Edit';
    sessionStorage.setItem('edit-id', message.id);
    const editCancel = createElement('div', 'edit-cancel', dialogueForm);
    editCancel.addEventListener('click', () => {
      dialogueMessage.value = '';
      sendButton.textContent = 'Send';
      confirmationDialogVisible = false;
      editCancel.remove();
    });
  });
}

function createNewMessage(message: Message, sessionData: User | null) {
  const dialogueContent = document.querySelector('.dialogue-content') as HTMLElement;
  if (dialogueContent.childElementCount === 0) {
    dialogueContent.textContent = '';
  }
  const dialogueContainer = createElement('div', 'dialogue-container', dialogueContent);
  const messageContainer = createElement('div', 'message-container', dialogueContainer);
  const messageHeader = createElement('div', 'message-header', messageContainer);
  createElement('div', 'message-text', messageContainer, `${message.text}`);
  const messageFooter = createElement('div', 'message-footer', messageContainer);
  dialogueContainer.setAttribute('id', message.id);
  let messageStatusEdit = '';
  let messageStatus = '';
  if (message.status.isDelivered) {
    messageStatus = 'delivered';
  } else if (message.status.isReaded) {
    messageStatus = 'read';
  } else {
    messageStatus = 'sent';
  }
  if (message.status.isEdited) {
    messageStatusEdit = 'edited';
  }
  if (message.from === sessionData?.firstName) {
    createElement('div', 'message-sender', messageHeader, 'you');
    createElement('div', 'message-status__edit', messageFooter, `${messageStatusEdit}`);
    createElement('div', 'message-status', messageFooter, `${messageStatus}`);
    messageContainer.style.cursor = 'pointer';
    messageContainer.addEventListener('click', () => {
      if (!confirmationDialogVisible) {
        createConfirmationDialog(message, messageContainer);
        confirmationDialogVisible = true;
      }
    });
  } else {
    createElement('div', 'message-status__edit', messageFooter, `${messageStatusEdit}`);
    createElement('div', 'message-sender', messageHeader, `${message.from}`);
    dialogueContainer.style.justifyContent = 'flex-start';
  }
  createElement(
    'div',
    'message-time',
    messageHeader,
    `${new Date(message.datetime).toLocaleDateString()}, ${new Date(message.datetime).toLocaleTimeString()}`,
  );
  dialogueContent.scrollTo({
    top: dialogueContent.scrollHeight,
    behavior: 'smooth',
  });
}

function updateMessageCount(messageData: Message) {
  const userLoginElements = document.querySelectorAll('.user-login');
  userLoginElements.forEach((element) => {
    if (element.textContent?.trim() === messageData.from) {
      const userElement = element.closest('.user');
      if (userElement instanceof HTMLElement) {
        const newMessage = userElement.querySelector('.new-message');
        if (newMessage instanceof HTMLElement) {
          let newMessageCount = Number(newMessage.getAttribute('data-message-count')) || 0;
          newMessageCount += 1;
          newMessage.setAttribute('data-message-count', newMessageCount.toString());
          newMessage.textContent = newMessageCount.toString();
          newMessage.style.display = 'flex';
        }
      }
    }
  });
}

ws.addEventListener('message', (event) => {
  console.log(event.data);
  const data = JSON.parse(event.data);
  const sessionData = sessionStorageManager.getUserData();
  if (data.type === 'USER_ACTIVE') {
    data.payload.users.forEach((user: UserLogin) => {
      if (user.login !== sessionData?.firstName) {
        createNewActiveUser(user);
      }
    });
  }
  if (data.type === 'USER_INACTIVE') {
    data.payload.users.forEach((user: UserLogin) => {
      if (user.login !== sessionData?.firstName) {
        createNewInactiveUser(user);
      }
    });
  }
  if (data.type === 'USER_EXTERNAL_LOGIN') {
    const { user } = data.payload;
    const userLoginElements = document.querySelectorAll('.user-login');
    const userLogins = Array.from(userLoginElements).map((el) => el.textContent);
    if (user.login !== sessionData?.firstName && !userLogins.some((log) => log === user.login)) {
      createNewActiveUser(user);
    } else {
      userLoginElements.forEach((element) => {
        if (element.textContent?.trim() === user.login) {
          const userElement = element.closest('.user');
          if (userElement) {
            const userStatusElement = userElement.querySelector('.user-status') as HTMLElement;
            userStatusElement.style.backgroundColor = '#4cac1f';
          }
        }
        const dialogueHeaderName = document.querySelector('.dialogue-header__name') as HTMLElement;
        const dialogueHeaderStatus = document.querySelector('.dialogue-header__status') as HTMLElement;
        if (dialogueHeaderName.textContent === user.login) {
          dialogueHeaderStatus.style.color = '#4cac1f';
          dialogueHeaderStatus.textContent = 'online';
        }
      });
    }
  }
  if (data.type === 'USER_EXTERNAL_LOGOUT') {
    const { user } = data.payload;
    if (user.login !== sessionData?.firstName) {
      const userLoginElements = document.querySelectorAll('.user-login');
      userLoginElements.forEach((element) => {
        if (element.textContent?.trim() === user.login) {
          const userElement = element.closest('.user');
          if (userElement) {
            const userStatusElement = userElement.querySelector('.user-status') as HTMLElement;
            userStatusElement.style.backgroundColor = '#494a45a0';
          }
        }
        const dialogueHeaderName = document.querySelector('.dialogue-header__name') as HTMLElement;
        const dialogueHeaderStatus = document.querySelector('.dialogue-header__status') as HTMLElement;
        if (dialogueHeaderName.textContent === user.login) {
          dialogueHeaderStatus.style.color = '#494a45a0';
          dialogueHeaderStatus.textContent = 'offline';
        }
      });
    }
  }
  updateDialogue();
  if (data.type === 'USER_LOGIN') {
    createChat();
    form.style.display = 'none';
  }
  if (data.type === 'ERROR') {
    modalText.innerText = data.payload.error;
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    document.body.classList.add('lock');
  }
  if (data.type === 'MSG_SEND') {
    const { message } = data.payload;
    if (data.payload.message.from === sessionData?.firstName) {
      createNewMessage(message, sessionData);
    } else {
      const dialogueHeaderName = document.querySelector('.dialogue-header__name') as HTMLElement;
      if (dialogueHeaderName.textContent === data.payload.message.from) {
        createNewMessage(message, sessionData);
      } else {
        updateMessageCount(data.payload.message);
      }
    }
  }
  if (data.type === 'MSG_FROM_USER') {
    const dialogueName = document.querySelector('.dialogue-header__name') as HTMLElement;
    if (dialogueName.textContent === '' && data.payload.messages.length !== 0) {
      data.payload.messages.forEach((messageData: Message) => {
        updateMessageCount(messageData);
      });
    } else {
      data.payload.messages.forEach((messageData: Message) => {
        createNewMessage(messageData, sessionData);
      });
    }
  }
  if (data.type === 'MSG_DELETE') {
    const container = document.getElementById(data.payload.message.id);
    container?.remove();
  }
  if (data.type === 'MSG_EDIT') {
    const container = document.getElementById(data.payload.message.id);
    const messageText = container?.querySelector('.message-text');
    const messagEdit = container?.querySelector('.message-status__edit');
    if (messageText && messagEdit) {
      messageText.textContent = data.payload.message.text;
      if (data.payload.message.status.isEdited) {
        messagEdit.textContent = 'edited';
      }
    }
  }
  if (data.type === 'MSG_DELIVER') {
    const container = document.getElementById(data.payload.message.id);
    const messagStatus = container?.querySelector('.message-status');
    if (messagStatus) {
      if (messagStatus.textContent !== '' && data.payload.message.status.isDelivered) {
        messagStatus.textContent = 'delivered';
      }
    }
  }
});

ws.addEventListener('close', () => {
  modalText.innerText = 'Connection closed, trying to reconnect...';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modalButton.style.display = 'none';
  document.body.classList.add('lock');
});
