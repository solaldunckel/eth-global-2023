export type Channel = {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  posts?: Post[];
};

export type Message = {
  // id: string;
  authorId: string;
  content: string;
  timestamp: number;
};

export type Post = {
  topic_id: string;
  title: string;
  content: string;
  authorId: string;
  messages: Message[];
};
