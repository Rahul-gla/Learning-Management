import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllPurchasedCoursesQuery } from "@/features/api/purchaseApi";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetAllPurchasedCoursesQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true, // ✅ Refetch when page is visited
    }
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return <h1 className="text-red-500">Failed to get purchased courses</h1>;

  const purchasedCourses = data?.purchasedCourses || [];

  // Aggregate statistics per course
  const courseStats = {};

  purchasedCourses.forEach((purchase) => {
    const course = purchase.courseId;
    if (!course || !course._id) return;

    if (!courseStats[course._id]) {
      courseStats[course._id] = {
        name: course.courseTitle,
        totalRevenue: 0,
        salesCount: 0,
      };
    }

    courseStats[course._id].salesCount += 1;
    courseStats[course._id].totalRevenue += purchase.amount || 0;
  });

  const chartData = Object.values(courseStats);

  // Total overall stats
  const totalSales = purchasedCourses.length;
  const totalRevenue = purchasedCourses.reduce(
    (acc, p) => acc + (p.amount || 0),
    0
  );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Total Sales */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Course Revenue and Sales Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Sales and Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-gray-500">No courses sold yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(name) =>
                    name.length > 15 ? name.slice(0, 15) + "..." : name
                  }
                />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="salesCount"
                  stroke="#10b981"
                  name="Sales Count"
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#3b82f6"
                  name="Total Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
