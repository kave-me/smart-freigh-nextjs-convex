"use client"

import { IconCirclePlusFilled, IconListDetails, IconListLetters, IconMail } from "@tabler/icons-react"
import { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Upload Invoice"
              className={`bg-primary text-secondary-foreground/90 hover:bg-primary/90 hover:text-secondary-foreground cursor-pointer active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear ${pathname === "/dashboard/upload-invoice" ? "border border-primary" : ""}`}
            >
              <IconCirclePlusFilled />
              <Link href={"/dashboard/upload-invoice"}>
                <span >Upload Invoice</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className={`size-8 group-data-[collapsible=icon]:opacity-0 ${pathname === "/dashboard/escalations" ? "border-primary" : ""}`}
              variant="outline"
            >
              <Link href={"/dashboard/escalations"}><IconListDetails className={pathname === "/dashboard/escalations" ? "text-primary" : ""} /></Link>
              <span className="sr-only">Escalations list</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title}>
                {item.icon && <item.icon />}
                <Link href={item.url}>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
