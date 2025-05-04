"use client"

import * as React from "react"
import {
  Icon123,
  Icon360View,
  IconInnerShadowTop,
  IconMailFast
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import branding from "@/config/branding"
import { LayoutDashboardIcon, UploadIcon, ListIcon, WrenchIcon, TruckIcon, BarChartIcon, SettingsIcon } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Upload Invoice",
        url: "/dashboard/upload-invoice",
        icon: UploadIcon,
    },
    {
        title: "Invoices",
        url: "/dashboard/invoices",
        icon: ListIcon,
    },
    {
        title: "Vendors",
        url: "/dashboard/vendors",
        icon: WrenchIcon,
    },
    {
        title: "Trucks",
        url: "/dashboard/trucks",
        icon: TruckIcon,
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChartIcon,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: SettingsIcon,
    },
]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconMailFast className="!size-5" />
                <span className="text-base font-semibold">{branding.company.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
