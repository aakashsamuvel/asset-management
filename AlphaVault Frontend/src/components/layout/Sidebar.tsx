
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Building, 
  File,
  Inbox, 
  Settings, 
  Users,
  Wallet,
  Archive,
  Trash2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  active
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="w-full">
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                active && "bg-sidebar-accent text-sidebar-foreground font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="hidden lg:hidden">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission } = usePermissions();

  return (
    <div className="bg-sidebar h-full w-64 border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.ico" alt="AlphaVault Logo" className="h-6 w-6" />
          <span className="font-bold text-xl text-white">AlphaVault</span>
        </Link>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-3">
        <nav className="flex flex-col gap-1">
          <SidebarItem 
            icon={Archive} 
            label="Dashboard" 
            href="/" 
            active={currentPath === "/"} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="Assets" 
            href="/assets" 
            active={currentPath === "/assets"} 
          />
          <SidebarItem 
            icon={Building} 
            label="Vendors" 
            href="/vendors" 
            active={currentPath === "/vendors"} 
          />
          {/* <SidebarItem
            icon={File}
            label="Procurement"
            href="/procurement"
            active={currentPath === "/procurement"}
          /> */}
          
          <div className="mt-4 mb-2 px-3">
            <div className="text-xs uppercase text-sidebar-foreground/50 font-medium">
              Administration
            </div>
          </div>
          
          {hasPermission("viewUsers") && (
            <SidebarItem
              icon={Users}
              label="Users"
              href="/users"
              active={currentPath === "/users"}
            />
          )}
          {hasPermission("manageSettings") && (
            <SidebarItem
              icon={Settings}
              label="Settings"
              href="/settings"
              active={currentPath === "/settings"}
            />
          )}
          {hasPermission("manageAssets") && (
            <SidebarItem
              icon={Trash2}
              label="Recycle Bin"
              href="/recycle-bin"
              active={currentPath === "/recycle-bin"}
            />
          )}
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;
