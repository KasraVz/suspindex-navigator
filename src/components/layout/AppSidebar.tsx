import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileCheck,
  BarChart3,
  Award,
  Users,
  UserPlus,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const examItems = [
  { title: "Booked Tests", url: "/dashboard/exams/booked", icon: FileCheck },
  { title: "Test History", url: "/dashboard/exams/history", icon: BarChart3 },
  { title: "Feedback", url: "/dashboard/exams/feedback", icon: FileCheck },
];

const otherItems = [
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Certifications", url: "/dashboard/certifications", icon: Award },
  { title: "Community", url: "/dashboard/community", icon: Users },
  { title: "Referrals", url: "/dashboard/referrals", icon: UserPlus },
  { title: "Scholarship", url: "/dashboard/scholarship", icon: GraduationCap },
  { title: "Support", url: "/dashboard/support", icon: HelpCircle },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar variant="sidebar" className="w-64" collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/24cac4e2-dcdf-47c3-a730-ec68198e51ed.png" 
              alt="Supsindex" 
              className="h-8 w-auto"
            />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Exams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {examItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}