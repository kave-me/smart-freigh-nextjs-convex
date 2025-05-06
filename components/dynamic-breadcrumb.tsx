"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Skip the first empty segment and transform path into breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb segments with proper labels and hrefs
  const breadcrumbSegments: BreadcrumbSegment[] = segments.map(
    (segment, index) => {
      // Create the href for this segment (all segments up to this point)
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      // Format the segment label to be more readable
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        label,
        href,
        isCurrent: index === segments.length - 1,
      };
    },
  );

  // Add Dashboard as the first item if we're in a dashboard route and first segment isn't already dashboard
  const firstSegment = segments[0]?.toLowerCase();
  const isDashboardRoute = pathname.includes("/dashboard");
  const needsDashboardItem = isDashboardRoute && firstSegment !== "dashboard";

  // Only add Dashboard item if it's not already the first segment
  if (
    needsDashboardItem ||
    (segments.length > 0 && firstSegment !== "dashboard")
  ) {
    breadcrumbSegments.unshift({
      label: "Dashboard",
      href: "/dashboard",
      isCurrent: segments.length === 0 || pathname === "/dashboard",
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem
              className={
                index < breadcrumbSegments.length - 1 ? "hidden md:block" : ""
              }
            >
              {segment.isCurrent ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
