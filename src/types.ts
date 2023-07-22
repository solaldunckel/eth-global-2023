export interface Channel {
  id: string;
  name: string;
  category: string;
  query: string;
  image_url?: string;

  query_description: string;
  posts: Post[];
}

export type Message = {
  // id: string;
  authorId: string;
  content: string;
  timestamp: number;
};

export interface Post {
  channel_id: number;
  topic_id: string;
  author_address: string;
  title: string;
  content: string;
  comments: [];
}
