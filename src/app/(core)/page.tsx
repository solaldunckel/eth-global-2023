import { ConnectButton } from "@rainbow-me/rainbowkit";
import Xmtp from "../components/Xmtp";

export default function Home() {
  return (
    <div>
      <ConnectButton />
      <Xmtp />
    </div>
  );
}
