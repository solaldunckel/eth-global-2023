"use client";

import { useQuery } from "@tanstack/react-query";

async function discoverChannels() {
  return fetch("/api/discover").then((res) => res.json());
}

export default function Home() {
  const { data } = useQuery(["discover"], discoverChannels);

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-2 ">
        {data?.map((channel, idx) => {
          return (
            <div
              key={idx}
              className="bg-[#111111]/25 border border-gray-500/25 shadow-md rounded-md p-4"
            >
              <h1 className="text-2xl font-bold">{channel.name}</h1>
              <p className="text-gray-500 text-sm">{channel.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
