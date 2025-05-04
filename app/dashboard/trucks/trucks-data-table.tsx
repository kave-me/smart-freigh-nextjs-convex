"use client"

import * as React from "react"
import { IconTruck, IconDotsVertical } from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TrucksDataTableProps {
  data: any[]
}

export function DataTable({ data }: TrucksDataTableProps) {
  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Truck ID</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Body Type</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No trucks found. Add some trucks to get started.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((truck) => (
              <TableRow key={truck._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconTruck className="size-4" />
                    <span>{truck.truckEid}</span>
                  </div>
                </TableCell>
                <TableCell>{truck.make}</TableCell>
                <TableCell>{truck.model}</TableCell>
                <TableCell>{truck.year}</TableCell>
                <TableCell>
                  <Badge variant="outline">{truck.bodyType}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{truck.vin}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      >
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}