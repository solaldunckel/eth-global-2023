import { useQuery } from "@tanstack/react-query";
import { useXmtp } from "./useXmtp";

export function useConversation() {
  const { xmtp } = useXmtp();

  return useQuery(["xmtpConversations"], () => xmtp?.conversations.list(), {
    enabled: !!xmtp,
  });
}
