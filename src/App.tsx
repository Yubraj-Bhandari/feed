
import { useLocation } from 'react-router-dom';
import AppRoutes from './Router';
import { useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from 'sonner';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    if (hideSidebar) {
      
    }
  }, [hideSidebar]);

  return (
    <SidebarProvider>
      {!hideSidebar && <AppSidebar />}
      <main className={`flex flex-1 flex-col ${hideSidebar ? '' : 'relative'}`}>
        {!hideSidebar && (
          <div className="sticky top-0 z-50 bg-background p-2 pb-0">
            <SidebarTrigger />
          </div>
        )}
        <div className={hideSidebar ? '' : 'px-2'}>
          <AppRoutes />
        </div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
