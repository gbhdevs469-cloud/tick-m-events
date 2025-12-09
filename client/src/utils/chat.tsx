export interface User {
  _id: string;
  name: string;
  // Add other user properties as needed
}

export interface Message {
  _id: string;
  eventId: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatContextType {
  messages: Message[];
  currentChat: User | null;
  chatPartners: User[];
  loading: boolean;
  setCurrentChat: (user: User | null) => void;
  fetchMessages: (eventId: string, otherUserId: string) => Promise<void>;
  fetchChatPartners: (eventId: string) => Promise<void>;
  sendMessage: (eventId: string, receiverId: string, content: string) => Promise<Message>;
  startPolling: (eventId: string, otherUserId: string) => void;
  stopPolling: () => void;
}