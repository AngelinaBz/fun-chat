import createElement from './create-element';

export default function createInfo(backPage: HTMLElement) {
  const infoContainer = createElement('div', 'info-container', document.body);
  createElement('h1', 'info-header', infoContainer, 'Fun Chat');
  createElement(
    'p',
    'info-text',
    infoContainer,
    'The application is designed to allow communication and information sharing between course students',
  );
  createElement('p', 'info-text', infoContainer, 'Author: AngelinaBz');
  const infoButton = createElement('button', 'info-button', infoContainer, 'Back');
  infoButton.addEventListener('click', () => {
    infoContainer.remove();
    const back = backPage;
    back.style.display = 'flex';
  });
}
