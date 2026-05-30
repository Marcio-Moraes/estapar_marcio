import { Sidebar } from "@/components/layout/sidebar";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
