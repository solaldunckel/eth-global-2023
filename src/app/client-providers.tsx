"use client";

import { SessionProvider } from "next-auth/react";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useState, type FC, createContext } from "react";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Client } from "@xmtp/xmtp-js";
import { XmtpContext } from "@/hooks/useXmtp";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Funnel app",
});

const { chains, publicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: "i25CEzZu6JD-2uH08tSkKRJKzGts26PE" })]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "9ba00acac3ceed7f113b2fb42d10a58c",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

type ClientProvidersProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

const ClientProviders: FC<ClientProvidersProps> = ({ children }) => {
  const [xmtp, setXmtp] = useState<Client | undefined>(undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider refetchInterval={0}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider chains={chains}>
              <XmtpContext.Provider value={{ xmtp, setXmtp }}>
                {children}
                <ReactQueryDevtools position="bottom-right" />
              </XmtpContext.Provider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default ClientProviders;
