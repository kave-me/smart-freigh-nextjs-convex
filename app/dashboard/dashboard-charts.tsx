"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Status colors for consistency
const STATUS_COLORS: Record<string, string> = {
  need_action: "#EAB308", // yellow-500
  escalated: "#A855F7", // purple-500
};

// Color palette for charts
const CHART_COLORS = [
  "#0284C7", // sky-600
  "#9333EA", // purple-600
  "#EA580C", // orange-600
  "#059669", // emerald-600
  "#DC2626", // red-600
  "#2563EB", // blue-600
  "#D97706", // amber-600
  "#C026D3", // fuchsia-600
  "#0369A1", // sky-700
  "#4F46E5", // indigo-600
];

// Define a custom label render props type instead of using PieLabelRenderProps
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

export function InvoiceStatusChart() {
  const chartData = useQuery(api.invoices.getInvoiceChartData);
  const [viewType, setViewType] = useState<"count" | "amount">("amount");
  const [activeIndex, setActiveIndex] = useState(0);

  if (!chartData) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Invoice Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusData = chartData.byStatus;

  // Calculate totals for percentage calculation
  const total = statusData.reduce((sum, item) => sum + item[viewType], 0);

  const onPieEnter = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  // Use our custom label props type
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={index === activeIndex ? "bold" : "normal"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Invoice Status</CardTitle>
        <Select
          value={viewType}
          onValueChange={(value) => setViewType(value as "count" | "amount")}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">By Count</SelectItem>
            <SelectItem value="amount">By Amount</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {statusData.map((entry, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`status-gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        STATUS_COLORS[entry.status] ||
                        CHART_COLORS[index % CHART_COLORS.length]
                      }
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        STATUS_COLORS[entry.status] ||
                        CHART_COLORS[index % CHART_COLORS.length]
                      }
                      stopOpacity={0.8}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                nameKey="status"
                dataKey={viewType}
                outerRadius={120}
                label={renderCustomizedLabel}
                fill="#8884d8"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={1000}
                paddingAngle={4}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#status-gradient-${index})`}
                    stroke={
                      STATUS_COLORS[entry.status] ||
                      CHART_COLORS[index % CHART_COLORS.length]
                    }
                    strokeWidth={activeIndex === index ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const formattedValue =
                    viewType === "amount"
                      ? formatCurrency(value as number)
                      : value;
                  const percentage =
                    (((value as number) / total) * 100).toFixed(1) + "%";
                  return [`${formattedValue} (${percentage})`, name];
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonthlyInvoiceChart() {
  const chartData = useQuery(api.invoices.getInvoiceChartData);
  const [timeRange, setTimeRange] = useState<"all" | "6m" | "3m">("all");

  if (!chartData) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Monthly Invoice Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  let monthlyData = [...chartData.byMonth];

  // Filter data based on selected time range
  if (timeRange !== "all") {
    const months = timeRange === "3m" ? 3 : 6;
    monthlyData = monthlyData.slice(-months);
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Monthly Invoice Volume
        </CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "all" | "6m" | "3m")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="total">
          <TabsList>
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="status">By Status</TabsTrigger>
          </TabsList>

          <TabsContent value="total" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0284C7"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#22C55E"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      const date = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                      );
                      return date.toLocaleDateString(undefined, {
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Invoice Amount")
                        return [formatCurrency(value as number), name];
                      return [value, name];
                    }}
                    labelFormatter={(value) => {
                      const [year, month] = value.split("-");
                      const date = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                      );
                      return date.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name="Invoice Count"
                    stroke="#0284C7"
                    fill="url(#colorCount)"
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    name="Invoice Amount"
                    stroke="#22C55E"
                    fill="url(#colorAmount)"
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      const date = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                      );
                      return date.toLocaleDateString(undefined, {
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      (name as string).charAt(0).toUpperCase() +
                        (name as string).slice(1).replace(/_/g, " "),
                    ]}
                    labelFormatter={(value) => {
                      const [year, month] = value.split("-");
                      const date = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                      );
                      return date.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Legend
                    formatter={(value) =>
                      typeof value === "string"
                        ? value.charAt(0).toUpperCase() +
                          value.slice(1).replace(/_/g, " ")
                        : value
                    }
                  />
                  <Bar
                    dataKey="need_action"
                    name="Need Action"
                    stackId="a"
                    fill={STATUS_COLORS.need_action}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="escalated"
                    name="Escalated"
                    stackId="a"
                    fill={STATUS_COLORS.escalated}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function TopSpendChart() {
  const chartData = useQuery(api.invoices.getInvoiceChartData);
  const trucks = useQuery(api.trucks.getAllTrucks);
  const vendors = useQuery(api.vendors.getAllVendors);
  const [viewType, setViewType] = useState<"trucks" | "vendors">("trucks");
  const [dataType, setDataType] = useState<"amount" | "count">("amount");
  const [activeBar, setActiveBar] = useState<number | null>(null);

  if (!chartData || !trucks || !vendors) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Top Spend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Map truck and vendor IDs to their display names
  const trucksMap = new Map(
    trucks.map((truck) => [
      truck._id,
      `${truck.make} ${truck.model} (${truck.truckEid})`,
    ]),
  );

  const vendorsMap = new Map(
    vendors.map((vendor) => [vendor._id, vendor.name]),
  );

  // Prepare chart data
  const truckData = chartData.byTruck.map((item) => ({
    id: item.truckId,
    name:
      trucksMap.get(item.truckId) || `Truck ${String(item.truckId).slice(-6)}`,
    amount: item.amount,
    count: item.count,
  }));

  const vendorData = chartData.byVendor.map((item) => ({
    id: item.vendorId,
    name:
      vendorsMap.get(item.vendorId) ||
      `Vendor ${String(item.vendorId).slice(-6)}`,
    amount: item.amount,
    count: item.count,
  }));

  const data = viewType === "trucks" ? truckData : vendorData;

  // Handle bar mouse events
  const handleBarMouseEnter = (
    _: React.MouseEvent<SVGElement>,
    index: number,
  ) => {
    setActiveBar(index);
  };

  const handleBarMouseLeave = () => {
    setActiveBar(null);
  };

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl font-semibold">
          Top {viewType === "trucks" ? "Trucks" : "Vendors"} by Spend
        </CardTitle>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <Tabs
            value={viewType}
            onValueChange={(v) => setViewType(v as "trucks" | "vendors")}
          >
            <TabsList>
              <TabsTrigger value="trucks">Trucks</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={dataType}
            onValueChange={(v) => setDataType(v as "amount" | "count")}
          >
            <TabsList>
              <TabsTrigger value="amount">Amount</TabsTrigger>
              <TabsTrigger value="count">Count</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
              onMouseLeave={handleBarMouseLeave}
            >
              <defs>
                <linearGradient id="colorTruckBar" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="5%"
                    stopColor={viewType === "trucks" ? "#0284C7" : "#A855F7"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={viewType === "trucks" ? "#2563EB" : "#C026D3"}
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  dataType === "amount"
                    ? formatCurrency(value)
                    : value.toString()
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tickFormatter={(value) =>
                  value.length > 20 ? `${value.substring(0, 20)}...` : value
                }
              />
              <Tooltip
                formatter={(value) => [
                  dataType === "amount"
                    ? formatCurrency(value as number)
                    : value,
                  dataType === "amount" ? "Amount" : "Count",
                ]}
                labelFormatter={(label) => `${label}`}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                }}
              />
              <Legend />
              <Bar
                dataKey={dataType}
                name={
                  dataType === "amount" ? "Invoice Amount" : "Invoice Count"
                }
                fill="url(#colorTruckBar)"
                radius={[0, 4, 4, 0]}
                onMouseEnter={handleBarMouseEnter}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={activeBar === index ? 1 : 0.8}
                    strokeWidth={activeBar === index ? 2 : 0}
                    stroke={viewType === "trucks" ? "#0C4A6E" : "#6B21A8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdvancedAnalysisCharts() {
  const truckStats = useQuery(api.trucks.getTruckStatistics);
  const vendorStats = useQuery(api.vendors.getVendorStatistics);
  const [viewType, setViewType] = useState<"spend" | "count" | "avg">("spend");
  const [timeRange, setTimeRange] = useState<"all" | "6m" | "3m">("all");

  if (!truckStats || !vendorStats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // Filter data based on time range if needed (using mock date filtering for now)
  // In a real implementation, you would filter based on actual invoice dates
  let filteredTruckStats = [...truckStats];
  let filteredVendorStats = [...vendorStats];

  // Could add actual time filtering here if we had date data in the statistics
  if (timeRange !== "all") {
    // Example filter (not implemented with real date filtering yet)
    const numTrucks = timeRange === "3m" ? 3 : 5;
    filteredTruckStats = filteredTruckStats.slice(0, numTrucks);
    filteredVendorStats = filteredVendorStats.slice(0, numTrucks);
  }

  // Prepare truck data for chart
  const topTrucks = filteredTruckStats.slice(0, 5).map((truck) => ({
    name: `${truck.make} ${truck.model} (${truck.truckEid})`,
    spend: truck.totalSpend,
    count: truck.invoiceCount,
    avg: truck.avgInvoiceAmount,
  }));

  // Prepare vendor data for chart
  const topVendors = filteredVendorStats.slice(0, 5).map((vendor) => ({
    name: vendor.name,
    spend: vendor.totalSpend,
    count: vendor.invoiceCount,
    avg: vendor.avgInvoiceAmount,
    location: `${vendor.city}, ${vendor.state}`,
  }));

  // Select the appropriate data key based on view type
  const getDataKey = () => {
    switch (viewType) {
      case "spend":
        return "spend";
      case "count":
        return "count";
      case "avg":
        return "avg";
      default:
        return "spend";
    }
  };

  // Format value based on data type
  const formatValue = (value: number, type: string) => {
    if (type === "spend" || type === "avg") {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-medium">Analysis View</h3>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Tabs
            value={viewType}
            onValueChange={(v) => setViewType(v as "spend" | "count" | "avg")}
          >
            <TabsList>
              <TabsTrigger value="spend">By Spend</TabsTrigger>
              <TabsTrigger value="count">By Count</TabsTrigger>
              <TabsTrigger value="avg">By Average</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as "all" | "6m" | "3m")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Top 5 Trucks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTrucks}>
                  <defs>
                    <linearGradient id="colorTruck" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0284C7"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      value.length > 15 ? `${value.substring(0, 15)}...` : value
                    }
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      viewType === "count"
                        ? value.toString()
                        : formatCurrency(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => {
                      return [
                        formatValue(value as number, viewType),
                        viewType === "spend"
                          ? "Total Spend"
                          : viewType === "count"
                            ? "Invoice Count"
                            : "Avg Invoice",
                      ];
                    }}
                    labelFormatter={(name) => name}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar
                    dataKey={getDataKey()}
                    name={
                      viewType === "spend"
                        ? "Total Spend"
                        : viewType === "count"
                          ? "Invoice Count"
                          : "Avg Invoice"
                    }
                    fill="url(#colorTruck)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Top 5 Vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVendors}>
                  <defs>
                    <linearGradient
                      id="colorVendor"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#A855F7"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      value.length > 15 ? `${value.substring(0, 15)}...` : value
                    }
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      viewType === "count"
                        ? value.toString()
                        : formatCurrency(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => {
                      return [
                        formatValue(value as number, viewType),
                        viewType === "spend"
                          ? "Total Spend"
                          : viewType === "count"
                            ? "Invoice Count"
                            : "Avg Invoice",
                      ];
                    }}
                    labelFormatter={(name) => {
                      const vendor = topVendors.find((v) => v.name === name);
                      return vendor ? `${name} (${vendor.location})` : name;
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar
                    dataKey={getDataKey()}
                    name={
                      viewType === "spend"
                        ? "Total Spend"
                        : viewType === "count"
                          ? "Invoice Count"
                          : "Avg Invoice"
                    }
                    fill="url(#colorVendor)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function GeographicAnalysisChart() {
  const vendorStats = useQuery(api.vendors.getVendorStatistics);
  const [viewType, setViewType] = useState<"state" | "city">("state");
  const [dataType, setDataType] = useState<"spend" | "count" | "vendors">(
    "spend",
  );

  if (!vendorStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for geographic charts
  const stateData = new Map();
  const cityData = new Map();

  vendorStats.forEach((vendor) => {
    // Process state data
    if (!stateData.has(vendor.state)) {
      stateData.set(vendor.state, {
        name: vendor.state,
        vendorCount: 0,
        invoiceCount: 0,
        totalSpend: 0,
      });
    }
    const stateStats = stateData.get(vendor.state);
    stateStats.vendorCount++;
    stateStats.invoiceCount += vendor.invoiceCount;
    stateStats.totalSpend += vendor.totalSpend;

    // Process city data
    const cityKey = `${vendor.city}, ${vendor.state}`;
    if (!cityData.has(cityKey)) {
      cityData.set(cityKey, {
        name: cityKey,
        state: vendor.state,
        vendorCount: 0,
        invoiceCount: 0,
        totalSpend: 0,
      });
    }
    const cityStats = cityData.get(cityKey);
    cityStats.vendorCount++;
    cityStats.invoiceCount += vendor.invoiceCount;
    cityStats.totalSpend += vendor.totalSpend;
  });

  // Convert to arrays and sort
  const stateChartData = Array.from(stateData.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10); // Top 10 states

  const cityChartData = Array.from(cityData.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10); // Top 10 cities

  const chartData = viewType === "state" ? stateChartData : cityChartData;

  // Determine which data field to display
  const getDataKey = () => {
    switch (dataType) {
      case "spend":
        return "totalSpend";
      case "count":
        return "invoiceCount";
      case "vendors":
        return "vendorCount";
      default:
        return "totalSpend";
    }
  };

  // Format tooltip values
  const formatTooltip = (value: number, name: string) => {
    if (name === "totalSpend") return [formatCurrency(value), "Total Spend"];
    if (name === "vendorCount") return [value, "Vendor Count"];
    if (name === "invoiceCount") return [value, "Invoice Count"];
    return [value, name];
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl font-semibold">
          Geographic Distribution
        </CardTitle>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <Tabs
            value={viewType}
            onValueChange={(v) => setViewType(v as "state" | "city")}
          >
            <TabsList>
              <TabsTrigger value="state">By State</TabsTrigger>
              <TabsTrigger value="city">By City</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={dataType}
            onValueChange={(v) =>
              setDataType(v as "spend" | "count" | "vendors")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spend">Total Spend</SelectItem>
              <SelectItem value="count">Invoice Count</SelectItem>
              <SelectItem value="vendors">Vendor Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <defs>
                <linearGradient id="colorGeo" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={1} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  dataType === "spend"
                    ? formatCurrency(value)
                    : value.toString()
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tickFormatter={(value) =>
                  value.length > 20 ? `${value.substring(0, 20)}...` : value
                }
              />
              <Tooltip
                formatter={(value, name) =>
                  formatTooltip(value as number, name as string)
                }
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              />
              <Bar
                dataKey={getDataKey()}
                name={
                  dataType === "spend"
                    ? "Total Spend"
                    : dataType === "count"
                      ? "Invoice Count"
                      : "Vendor Count"
                }
                fill="url(#colorGeo)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceAnalysisCharts() {
  const chartData = useQuery(api.invoices.getInvoiceChartData);

  if (!chartData) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[400px] col-span-2" />
          <Skeleton className="h-[400px] col-span-2" />
        </div>
        <Skeleton className="h-[400px]" />
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Equipment & Vendor Analysis
          </h2>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InvoiceStatusChart />
        <MonthlyInvoiceChart />
      </div>
      <TopSpendChart />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Equipment & Vendor Analysis
        </h2>
        <div className="space-y-6">
          <AdvancedAnalysisCharts />
          <GeographicAnalysisChart />
        </div>
      </div>
    </div>
  );
}
