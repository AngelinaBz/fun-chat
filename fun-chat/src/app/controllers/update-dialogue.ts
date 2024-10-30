export default function updateDialogue() {
  const users = document.querySelectorAll('.user') as NodeListOf<HTMLElement>;
  const dialogueContent = document.querySelector('.dialogue-content') as HTMLElement;
  const dialogueHeaderName = document.querySelector('.dialogue-header__name') as HTMLElement;
  const dialogueHeaderStatus = document.querySelector('.dialogue-header__status') as HTMLElement;
  // const sendButton = document.querySelector('.dialogue-button') as HTMLButtonElement;
  const dialogueMessage = document.querySelector('.dialogue-message') as HTMLInputElement;

  users.forEach((user: HTMLElement) => {
    user.addEventListener('click', () => {
      const userLogin = user.querySelector('.user-login')?.textContent;
      const userStatus = user.querySelector('.user-status') as HTMLElement;
      dialogueContent.textContent = 'Say the first "Hello"...';
      if (userStatus.style.backgroundColor === 'rgb(76, 172, 31)') {
        dialogueHeaderName.textContent = `${userLogin}`;
        dialogueHeaderStatus.textContent = 'online';
        dialogueHeaderStatus.style.color = '#4cac1f';
      } else {
        dialogueHeaderName.textContent = `${userLogin}`;
        dialogueHeaderStatus.textContent = 'offline';
        dialogueHeaderStatus.style.color = '#494a45a0';
      }
      // sendButton.disabled = false;
      dialogueMessage.disabled = false;
    });
  });
}
