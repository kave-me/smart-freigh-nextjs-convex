"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReactNode } from "react"

type SectionCardProps = {
  title?: string
  description?: string
  icon?: ReactNode
  footer?: ReactNode
  loading?: boolean
  trendBadge?: ReactNode
}

export function SectionCard({
  title,
  description,
  icon,
  footer,
  loading = false,
  trendBadge,
}: SectionCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          {loading ? <Skeleton className="h-4 w-24" /> : description}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading ? <Skeleton className="h-8 w-32" /> : title}
        </CardTitle>
        <CardAction>
          {loading ? <Skeleton className="h-6 w-16" /> : trendBadge ?? icon}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        {loading ? (
          <>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </>
        ) : (
          footer
        )}
      </CardFooter>
    </Card>
  )
}
