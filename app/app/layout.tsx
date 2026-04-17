import SideNav from "@/components/sidenav/sidenav"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SideNav />
      <main className="mx-auto max-w-7xl w-full min-h-screen mt-24">
        {children}
      </main>
    </SidebarProvider>
  )
}