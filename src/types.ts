import { users } from "@prisma/client";

export interface Channel {
  id: number;
  name: string;
  category: string;
  query: string;
  image_url?: string;
  condition: string;
  description: string;
  nb_users: number;
  posts: Post[];
}

export type Message = {
  // id: string;
  author: User;
  content: string;
  timestamp: string;
};

export interface Post {
  channel_id: number;
  topic_id: string;
  author_address: string;
  timestamp: string;
  title: string;
  content: string;
  author: User;
  comments: Message[];
}

export interface User {
  address: string;
  username?: string | null;
  profile_pic_url?: string | null;
}
