import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="grow overflow-scroll max-h-screen">{children}</div>
    </div>
  );
}
