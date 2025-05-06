"use client";

import * as React from "react";
import { IconMailFast } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import branding from "@/config/branding";
import {
  LayoutDashboardIcon,
  ListIcon,
  WrenchIcon,
  TruckIcon,
  BarChartIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const user = useQuery(api.users.getUser)
  const defaultUser = {
    name: "Guest",
    email: "guest@example.com",
    avatar: "",
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconMailFast className="!size-5" />
                <span className="text-base font-semibold">
                  {branding.company.name}
                </span>
              </Link>
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
        <NavUser user={defaultUser} />
      </SidebarFooter>
      {/* </SidebarFooter> */}
    </Sidebar>
  );
}
