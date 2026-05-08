import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Settings, 
  Menu,
  Bell,
  Plus,
  LayoutGrid
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/features/auth/components/UserProfileCard";
import { useMe } from "@/features/profile/hooks/useMe";
import { useAuthStore } from "@/features/auth/store";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/owner" },
  { label: "Quản lý cơ sở", icon: Building2, path: "/owner/courts" },
  { label: "Quản lý sân con", icon: LayoutGrid, path: "/owner/sub-courts" },
  { label: "Quản lý lịch sân", icon: CalendarCheck, path: "/owner/schedules" },
  { label: "Cài đặt", icon: Settings, path: "/owner/settings" },
];

export default function OwnerLayout() {
  const { accessToken, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Đồng bộ hóa dữ liệu profile
  const { isLoading: isProfileLoading } = useMe();

  if (!accessToken || !user) {
    navigate("/login");
    return null;
  }

  if (isProfileLoading && !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-emerald-900/40 font-bold text-xs uppercase tracking-[0.2em]">
            Đang đồng bộ dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden relative">
      <UserProfileCard />
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-100 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xl">R</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-gray-900">RallyHub</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/owner"}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-emerald-50 text-emerald-600 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn("shrink-0", isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-900")} />
                  {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-8 mt-auto flex justify-center">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] leading-none">
              Owner Session
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:bg-gray-50 rounded-xl"
          >
            <Menu size={20} />
          </Button>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-50 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
