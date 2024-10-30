export default function userSearch() {
  const usersSearch = document.querySelector('.users-search') as HTMLInputElement;
  const filter = usersSearch.value.toUpperCase();
  const users = Array.from(document.querySelectorAll('.user') as NodeListOf<HTMLElement>);

  users.forEach((user: HTMLElement) => {
    const username = user.querySelector('.user-login') as HTMLElement;
    const styleUser = user;
    if (username.innerText.toUpperCase().indexOf(filter) > -1) {
      styleUser.style.display = '';
    } else {
      styleUser.style.display = 'none';
    }
  });
}
