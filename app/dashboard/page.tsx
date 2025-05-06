import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"


export default function Page() {
  return (
    <>
      {/* <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} /> */}
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h1 className="text-3xl font-semibold">The Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Dashboard system is currently on wait to finish more important sections that are under development.
        </p>
      </div>
    </>

  )
}
