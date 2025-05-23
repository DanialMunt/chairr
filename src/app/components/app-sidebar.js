import { Dock, Home, RockingChair, FilePlus2, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from '../lib/AuthContext';
// Menu items.
const items = [
  {
    title: "Главная",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Скамейки",
    url: "/chairs",
    icon: RockingChair,
  },
  {
    title: "Заявки",
    url: "/applications",
    icon: Dock,
  },
  {
    title: "Добавить скамейку",
    url: "/add",
    icon: FilePlus2,
  },

]

export function AppSidebar() {

  const { isLoggedIn, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Модераторская</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <button onClick={logout} className="py-1 w-2/3 mt-1 text-red-500 border border-red-500 rounded-md cursor-pointer hover:opacity-50">
                Выйти
              </button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
