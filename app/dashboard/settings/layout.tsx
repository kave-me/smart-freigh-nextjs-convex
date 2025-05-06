'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Account', href: '/dashboard/settings/account' },
    { name: 'Business Rules', href: '/dashboard/settings/business-rules' },
    { name: 'Email Templates', href: '/dashboard/settings/email-templates' },
    { name: 'Company Info', href: '/dashboard/settings/company-info' },
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs className='items-center' value={pathname}>
        <TabsList className="flex gap-4 border-b">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              asChild
              className="px-4 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground"
            >
              <Link href={tab.href}>
                {tab.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}