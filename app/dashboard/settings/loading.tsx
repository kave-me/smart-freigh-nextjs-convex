'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsLoading() {
  const tabs = [
    { name: 'Account', href: '/dashboard/settings/account' },
    { name: 'Business Rules', href: '/dashboard/settings/business-rules' },
    { name: 'Email Templates', href: '/dashboard/settings/email-templates' },
    { name: 'Company Info', href: '/dashboard/settings/company-info' },
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs className="items-center">
        <TabsList className="flex gap-4 border-b">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className="px-4 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
              disabled
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="space-y-6">
        <div className="grid gap-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-8 w-[150px]" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-8 w-[180px]" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[280px]" />
            <Skeleton className="h-4 w-[220px]" />
          </div>
        </div>
      </div>
    </div>
  );
}