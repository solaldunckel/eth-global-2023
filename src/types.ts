export interface Channel {
  id: number;
  name: string;
  category: string;
  query: string;
  image_url?: string;
  query_description: string;
  posts: Post[];
}

export type Message = {
  // id: string;
  author_address: string;
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
  comments: Message[];
}
