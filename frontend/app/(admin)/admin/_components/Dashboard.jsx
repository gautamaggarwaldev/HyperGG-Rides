"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Calendar,
  TrendingUp,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function Dashboard({ initialData }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Show error if data fetch failed
  if (!initialData || !initialData.success) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {initialData?.error || "Failed to load dashboard data"}
        </AlertDescription>
      </Alert>
    );
  }

  const { cars, testDrives } = initialData.data;

  // Colors for charts
  const COLORS = {
    blue: "#3B82F6",
    green: "#10B981",
    amber: "#F59E0B",
    red: "#EF4444",
    gray: "#6B7280",
    lightBlue: "#93C5FD",
    purple: "#8B5CF6",
    indigo: "#6366F1",
  };

  // Data for car inventory pie chart
  const carInventoryData = [
    { name: "Available", value: cars.available, color: COLORS.green },
    { name: "Sold", value: cars.sold, color: COLORS.blue },
  ];

  // Data for test drive status pie chart
  const testDriveStatusData = [
    { name: "Pending", value: testDrives.pending, color: COLORS.amber },
    { name: "Confirmed", value: testDrives.confirmed, color: COLORS.green },
    { name: "Completed", value: testDrives.completed, color: COLORS.blue },
    { name: "Cancelled", value: testDrives.cancelled, color: COLORS.red },
    { name: "No Show", value: testDrives.noShow, color: COLORS.gray },
  ];

  // Data for test drive bar chart
  const testDriveBarData = [
    {
      name: "Pending",
      value: testDrives.pending,
      percentage: ((testDrives.pending / testDrives.total) * 100).toFixed(1),
      color: COLORS.amber,
    },
    {
      name: "Confirmed",
      value: testDrives.confirmed,
      percentage: ((testDrives.confirmed / testDrives.total) * 100).toFixed(1),
      color: COLORS.green,
    },
    {
      name: "Completed",
      value: testDrives.completed,
      percentage: ((testDrives.completed / testDrives.total) * 100).toFixed(1),
      color: COLORS.blue,
    },
    {
      name: "Cancelled",
      value: testDrives.cancelled,
      percentage: ((testDrives.cancelled / testDrives.total) * 100).toFixed(1),
      color: COLORS.red,
    },
    {
      name: "No Show",
      value: testDrives.noShow,
      percentage: ((testDrives.noShow / testDrives.total) * 100).toFixed(1),
      color: COLORS.gray,
    },
  ];

  // Data for the dealership metrics comparison
  const dealershipMetricsData = [
    {
      name: "Inventory",
      available: ((cars.available / cars.total) * 100).toFixed(0),
      sold: ((cars.sold / cars.total) * 100).toFixed(0),
    },
    {
      name: "Test Drives",
      completed: ((testDrives.completed / testDrives.total) * 100).toFixed(0),
      converted: testDrives.conversionRate,
    },
  ];

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${(
            (payload[0].value / payload[0].payload.total) *
            100
          ).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar charts
  const BarChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].payload.name}`}</p>
          <p className="text-sm text-gray-600">{`Count: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].payload.percentage}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom formatter for percent values in pie charts
  const renderCustomPercentage = (entry) => {
    return `${((entry.value / (entry.payload.total || 1)) * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="overview" className="text-base">
            <BarChart3 className="mr-2 h-5 w-5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="test-drives" className="text-base">
            <PieChart className="mr-2 h-5 w-5" /> Test Drives
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPI Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Car className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.total}</div>
                <p className="text-xs text-muted-foreground">
                  {cars.available} available, {cars.sold} sold
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Drives</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.total}</div>
                <p className="text-xs text-muted-foreground">
                  {testDrives.pending} pending, {testDrives.confirmed} confirmed
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">From test drives to sales</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.sold}</div>
                <p className="text-xs text-muted-foreground">
                  {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Car Inventory Pie Chart */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Car Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Pie
                        data={carInventoryData.map(item => ({ ...item, total: cars.total }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={renderCustomPercentage}
                        labelLine={false}
                      >
                        {carInventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-medium text-sm">Available</p>
                    <p className="text-xl font-bold text-green-600">{((cars.available / cars.total) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sold</p>
                    <p className="text-xl font-bold text-blue-600">{((cars.sold / cars.total) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dealership Metrics Bar Chart */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dealershipMetricsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="available" name="Available Inventory" fill={COLORS.green} barSize={20} />
                      <Bar dataKey="sold" name="Sold Inventory" fill={COLORS.blue} barSize={20} />
                      <Bar dataKey="completed" name="Completed Test Drives" fill={COLORS.lightBlue} barSize={20} />
                      <Bar dataKey="converted" name="Conversion Rate" fill={COLORS.purple} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Summary Section */}
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Dealership Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center shadow-sm">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">{cars.sold}</h3>
                  <p className="text-blue-600 font-medium">Cars Sold</p>
                  <p className="text-sm text-blue-500 mt-1">
                    {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg text-center shadow-sm">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">
                    {testDrives.pending + testDrives.confirmed}
                  </h3>
                  <p className="text-green-600 font-medium">Upcoming Test Drives</p>
                  <p className="text-sm text-green-500 mt-1">
                    {(
                      ((testDrives.pending + testDrives.confirmed) / testDrives.total) *
                      100
                    ).toFixed(1)}% of bookings
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg text-center shadow-sm">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">{testDrives.conversionRate}%</h3>
                  <p className="text-purple-600 font-medium">Conversion Rate</p>
                  <p className="text-sm text-purple-500 mt-1">Test drives to sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Drives Tab */}
        <TabsContent value="test-drives" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.total}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.pending / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.confirmed}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-indigo-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.completed / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.cancelled}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Test Drive Status Pie Chart */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Test Drive Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Pie
                        data={testDriveStatusData.map(item => ({ ...item, total: testDrives.total }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={renderCustomPercentage}
                        labelLine={false}
                      >
                        {testDriveStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Test Drive Bar Chart */}
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Test Drive Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={testDriveBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<BarChartTooltip />} />
                      <Bar dataKey="value" name="Count">
                        {testDriveBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Card */}
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Test Drive Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Conversion Rate Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-blue-800">Conversion Rate</h3>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {testDrives.conversionRate}%
                  </div>
                  <p className="text-sm text-blue-600">
                    Test drives resulting in car purchases
                  </p>
                  
                  <div className="mt-4 w-full bg-blue-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${testDrives.conversionRate}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-blue-600">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Completion Rate Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-green-800">Completion Rate</h3>
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {testDrives.total
                      ? ((testDrives.completed / testDrives.total) * 100).toFixed(1)
                      : 0}%
                  </div>
                  <p className="text-sm text-green-600">
                    Test drives successfully completed
                  </p>
                  
                  <div className="mt-4 w-full bg-green-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: `${(testDrives.completed / testDrives.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-green-600">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}