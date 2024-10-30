export interface User {
  firstName: string;
  password: string;
}
export interface UserLogin {
  login: string;
  isLogined: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export interface DataFromServer {
  id: null;
  type: string;
  payload: {
    message: Message;
  };
}
