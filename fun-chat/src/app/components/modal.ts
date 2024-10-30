import createElement from './create-element';

export default function createModal() {
  const modal = createElement('div', 'modal', document.body);
  const modalContainer = createElement('div', 'modal-container', modal);
  //  modalContainer.style.display = 'none';
  const modalText = createElement('p', 'modal-text', modalContainer);
  const okButton = createElement('button', 'modal-button', modalContainer, 'OK');
  okButton.addEventListener('click', () => {
    modalText.innerText = '';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    document.body.classList.remove('lock');
  });
}
createModal();
