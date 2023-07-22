import Xmtp from "@/components/Xmtp";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div>
      <ConnectButton />
      <Xmtp />
    </div>
  );
}
