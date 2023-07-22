"use client";

import { Client, Conversation } from "@xmtp/xmtp-js";
import * as React from "react";
import { useEthersSigner } from "@/lib/utils";
import { useXmtp } from "@/hooks/useXmtp";
import { getAddrInfo } from "@/lib/getAddrInfo";

const memberAddresses = [
  "0xD3fEb5B44A01DE6B91C33887F9e4021f61790D00",
  "0x53e2D75180488a62926e7c21fAE9006f23610bE2",
  "0x0abca868929aA10C67246135BD8940a1596663ed",
  "0x76A02bB3d4E6fCb32643A9cA38569f1A959b9d2c",
];

getAddrInfo("0xD3fEb5B44A01DE6B91C33887F9e4021f61790D00");

export default function Xmtp() {
  const signer = useEthersSigner();
  const [conversation, setConversation] = React.useState<
    Conversation | undefined
  >(undefined);
  const { xmtp, setXmtp } = useXmtp();

  const createConversation = async () => {
    const groupConversation = await xmtp?.conversations.newGroupConversation(
      memberAddresses
    );
    console.log(groupConversation, groupConversation?.topic);
    setConversation(groupConversation);
  };

  const sendMsg = () => {
    conversation?.send("Hello world");
  };

  const listChannel = async () => {
    const convList = await xmtp?.conversations.list();
    convList!.forEach((element) => {
      console.log(element.topic, ":", element.isGroup);
    });
  };

  return (
    <div>
      {xmtp ? (
        "You are connected to XMTP"
      ) : (
        <button
          onClick={() =>
            Client.create(signer!, { env: "production" }).then((xmtp) => {
              setXmtp(xmtp);
              xmtp.enableGroupChat();
            })
          }
        >
          Connect to XMTP
        </button>
      )}
      <p>
        <button onClick={createConversation}>create conv</button>
      </p>
      <p>
        <button onClick={listChannel}>list channels</button>
      </p>
      <p>
        <button onClick={sendMsg}>Send message</button>
      </p>
    </div>
  );
}
