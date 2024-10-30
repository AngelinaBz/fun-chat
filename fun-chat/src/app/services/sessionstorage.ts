import { User } from '../interface';

export default class SessionStorageManager {
  private userDataKey = 'userData';

  saveUserData(firstName: string, password: string) {
    const userData: User = {
      firstName,
      password,
    };

    sessionStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }

  getUserData(): User | null {
    const userDataString = sessionStorage.getItem(this.userDataKey);

    if (userDataString) {
      return JSON.parse(userDataString);
    }

    return null;
  }
}
