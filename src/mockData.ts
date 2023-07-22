import { Channel } from "./types";

export const mockDataCurrentUser = {
  id: "1",
  name: "John Doe",
  address: "0x1234567890",
  image_url: "https://avatars.githubusercontent.com/u/1?v=4",
};

export const mockDataChannels: Channel[] = [
  {
    id: "1",
    name: "ETH Global",
    category: "Event",
    image_url:
      "https://miro.medium.com/v2/resize:fit:2400/1*fHerDrCZy-D9W787CboY8Q.png",
    posts: [
      {
        id: "1",
        title: "ETH Global starts today!",
        content: "Don't forget to join the opening ceremony :)",
        authorId: "1",
        messages: [
          {
            id: "1",
            authorId: "1",
            content: "Hello World!",
            timestamp: 1629780000000,
          },
          {
            id: "2",
            authorId: "1",
            content: "Really looking forward to today's lineup!",
            timestamp: 1629866400000,
          },
        ],
      },
      {
        id: "2",
        title: "Day 2 of ETH Global!",
        content: "Stay tuned for more exciting presentations today.",
        authorId: "1",
        messages: [
          {
            id: "3",
            authorId: "1",
            content: "Yesterday's sessions were amazing!",
            timestamp: 1629952800000,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Curve OGs",
    category: "DeFi",
    image_url:
      "https://2254922201-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MFA0rQI3SzfbVFgp3Ic%2Fuploads%2FF5ZS9RzAWKZnNxm9F85H%2FCurve-Logo-HighRez.png?alt=media&token=51c58ab0-e774-4b30-92ac-69f643400c56",
    posts: [
      {
        id: "1",
        title: "Introduction to Curve OGs",
        content: "A beginner's guide to the world of DeFi.",
        authorId: "1",
        messages: [
          {
            id: "1",
            authorId: "1",
            content: "DeFi is the future of finance!",
            timestamp: 1630039200000,
          },
          {
            id: "2",
            authorId: "1",
            content: "Just getting started with Curve, so excited!",
            timestamp: 1630125600000,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "DeFi Dads",
    category: "DeFi",
    posts: [
      {
        id: "1",
        title: "Balancing DeFi and Family",
        content:
          "It's possible to enjoy DeFi while managing family responsibilities.",
        authorId: "1",
        messages: [
          {
            id: "1",
            authorId: "1",
            content: "Family is priority, but DeFi can co-exist.",
            timestamp: 1630212000000,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Bored Ape Holders",
    category: "NFT",
    posts: [
      {
        id: "1",
        title: "The Pros and Cons of Owning Bored Ape NFTs",
        content: "Discussing the ups and downs of owning this popular NFT.",
        authorId: "1",
        messages: [
          {
            id: "1",
            authorId: "1",
            content: "Bored Ape is the hottest NFT right now.",
            timestamp: 1630298400000,
          },
          {
            id: "2",
            authorId: "1",
            content: "The community around Bored Ape is fantastic!",
            timestamp: 1630384800000,
          },
        ],
      },
    ],
  },
];
