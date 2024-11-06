import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  DatePicker,
  Space,
  message,
  Tag,
  Table,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/charts";
import axios from "axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import config from "../../../config/config";
import LoadingKoi from "../../../components/loading";
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [fishes, setFishes] = useState([]);
  const [fishTypes, setFishTypes] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);

  // Function to fetch orders data
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllOrders(response.data);
      filterOrdersByDateRange(response.data, dateRange[0], dateRange[1]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders data");
    }
  };

  // Function to fetch customers data
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to fetch customers data");
    }
  };

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFishes(response.data);
    } catch (error) {
      console.error("Error fetching fish data:", error);
      message.error("Failed to fetch fish data");
    }
  };

  const fetchFishTypes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishtypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFishTypes(response.data);
    } catch (error) {
      console.error("Error fetching fish types:", error);
      message.error("Failed to fetch fish types data");
    }
  };

  // Calculate total revenue from filtered orders
  const calculateRevenue = (orders) => {
    return orders.reduce((total, order) => {
      const revenue = (order.totalAmount || 0) - (order.totalDiscount || 0);
      return total + revenue;
    }, 0);
  };

  // Filter orders by date range
  const filterOrdersByDateRange = (orders, startDate, endDate) => {
    const filtered = orders.filter((order) => {
      const orderDate = dayjs(order.orderDate);
      return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
    });
    setFilteredOrders(filtered);
  };

  const getOrderStatusDistribution = () => {
    const distribution = filteredOrders.reduce((acc, order) => {
      const status = getStatusText(order.status); // Convert status number to text
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / filteredOrders.length) * 100).toFixed(1),
    }));
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Paid";
      case 2:
        return "Cancelled";
      case 3:
        return "Shipping";
      case 4:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Add this color mapping for the pie chart
  const statusColors = {
    Paid: "#FFD700", // gold
    Cancelled: "#FF4D4F", // red
    Shipping: "#52C41A", // green
    Completed: "#52C41A", // green
    Unknown: "#D9D9D9", // default gray
  };

  // Process orders data for charts
  const processOrdersData = (orders) => {
    const dailyData = {};

    orders.forEach((order) => {
      const date = dayjs(order.orderDate).format("YYYY-MM-DD");
      if (!dailyData[date]) {
        dailyData[date] = {
          date, // Keep the full date format for proper sorting
          orders: 0,
          revenue: 0,
          fishSold: 0,
        };
      }

      dailyData[date].orders += 1;
      dailyData[date].revenue +=
        (order.totalAmount || 0) - (order.totalDiscount || 0);
      dailyData[date].fishSold +=
        order.orderLines?.reduce(
          (sum, line) => sum + (line.quantity || 0),
          0
        ) || 0;
    });

    return Object.values(dailyData).sort((a, b) =>
      dayjs(a.date).diff(dayjs(b.date))
    );
  };

  // Calculate total fish sold from filtered orders
  const calculateTotalFishSold = () => {
    return filteredOrders.reduce((total, order) => {
      return (
        total +
        (order.orderLines?.reduce(
          (sum, line) => sum + (line.quantity || 0),
          0
        ) || 0)
      );
    }, 0);
  };

  // Handle date range change
  const handleDateRangeChange = async (dates) => {
    if (!dates || dates.length !== 2) {
      return;
    }
    setDateRange(dates);
    filterOrdersByDateRange(allOrders, dates[0], dates[1]);
  };

  const getFishStats = () => {
    const totalFish = fishes.length;
    const avgPrice =
      fishes.reduce((sum, fish) => sum + (fish.price || 0), 0) / totalFish;
    const avgRating =
      fishes.reduce((sum, fish) => sum + (fish.overallRating || 0), 0) /
      totalFish;
    const inStock = fishes.filter((fish) => fish.quantity > 0).length;

    return { totalFish, avgPrice, avgRating, inStock };
  };

  // Fish type distribution for pie chart
  const getFishTypeDistribution = () => {
    const distribution = fishes.reduce((acc, fish) => {
      const typeName = getFishTypeName(fish.fishTypeId);
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / fishes.length) * 100).toFixed(1),
    }));
  };

  const getFishTypeName = (fishTypeId) => {
    const fishType = fishTypes.find((type) => type.fishTypeId === fishTypeId);
    return fishType ? fishType.name : "Unknown";
  };

  // Add this function to calculate top selling fish types
  const getTopSellingFishTypes = () => {
    const typesSales = {};

    // Calculate total quantity and revenue sold for each fish type
    filteredOrders.forEach((order) => {
      order.orderLines?.forEach((line) => {
        const fish = fishes.find((f) => f.fishId === line.fishId);
        const typeId = fish?.fishTypeId;
        const typeName = getFishTypeName(typeId);

        if (!typesSales[typeName]) {
          typesSales[typeName] = {
            type: typeName,
            totalSold: 0,
            revenue: 0,
            totalOrders: new Set(), // To count unique orders
          };
        }

        typesSales[typeName].totalSold += line.quantity || 0;
        typesSales[typeName].revenue += line.totalPrice || 0;
        typesSales[typeName].totalOrders.add(order.orderId);
      });
    });

    // Convert to array and calculate final metrics
    return Object.values(typesSales)
      .map((type) => ({
        ...type,
        orderCount: type.totalOrders.size,
      }))
      .sort((a, b) => b.totalSold - a.totalSold);
  };

  // Chart configurations
  // Update the getLineChartConfig function
  // Update the getLineChartConfig function to properly handle tooltips
  // const getLineChartConfig = (data, yField, title, color) => ({
  //   data,
  //   xField: "date",
  //   yField,
  //   smooth: true,
  //   meta: {
  //     date: { alias: "Date" },
  //     [yField]: {
  //       alias: title,
  //       formatter: (value) => {
  //         return yField === "revenue"
  //           ? `₫${value.toLocaleString()}`
  //           : value.toLocaleString();
  //       },
  //     },
  //   },
  //   color: color,
  //   point: {
  //     size: 4,
  //     shape: "diamond",
  //   },
  //   tooltip: {
  //     formatter: (datum) => {
  //       return {
  //         name: title,
  //         value:
  //           yField === "revenue"
  //             ? `₫${datum[yField].toLocaleString()}`
  //             : datum[yField].toLocaleString(),
  //       };
  //     },
  //   },
  //   xAxis: {
  //     label: {
  //       formatter: (v) => dayjs(v).format("MMM DD"),
  //     },
  //   },
  //   yAxis: {
  //     label: {
  //       formatter: (v) => {
  //         if (yField === "revenue") {
  //           return `₫${(v / 1000000).toFixed(0)}M`;
  //         }
  //         return v;
  //       },
  //     },
  //   },
  // });

  const getColumnChartConfig = (data) => ({
    data,
    xField: "date",
    yField: "fishSold",
    meta: {
      date: { alias: "Date" },
      fishSold: { alias: "Fish Sold" },
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    color: "#722ed1",
    tooltip: {
      title: "Date",
      formatter: (datum) => {
        return { name: "Fish Sold", value: datum.fishSold };
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          fetchOrders(),
          fetchCustomers(),
          fetchFishes(),
          fetchFishTypes(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <LoadingKoi />
      </div>
    );
  }

  const fishSection = (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Card title="Fish Statistics">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Total Fish"
                value={getFishStats().totalFish}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Average Price"
                value={getFishStats().avgPrice}
                precision={0}
                prefix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
                valueStyle={{ color: "#3f8600" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Average Rating"
                value={getFishStats().avgRating}
                precision={1}
                prefix={<StarOutlined />}
                suffix="/5"
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Fish in Stock"
                value={getFishStats().inStock}
                suffix={`/ ${getFishStats().totalFish}`}
                valueStyle={{ color: "#722ed1" }}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Fish Type Distribution">
          <Pie
            data={getFishTypeDistribution()}
            angleField="count"
            colorField="type"
            radius={0.8}
            label={{
              type: "outer",
              content: "{name}: {percentage}",
            }}
            interactions={[{ type: "element-active" }]}
            height={300}
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Top Selling Fish Types">
          <Table
            dataSource={getTopSellingFishTypes()}
            pagination={false}
            columns={[
              {
                title: "Type",
                dataIndex: "type",
                key: "type",
                render: (type) => <Tag color="blue">{type}</Tag>,
              },
              {
                title: "Total Sold",
                dataIndex: "totalSold",
                key: "totalSold",
                render: (value) => (
                  <Tag color="green">{value.toLocaleString()}</Tag>
                ),
                sorter: (a, b) => a.totalSold - b.totalSold,
              },
              {
                title: "Revenue",
                dataIndex: "revenue",
                key: "revenue",
                render: (value) => (
                  <span style={{ color: "#3f8600" }}>
                    ₫{value.toLocaleString()}
                  </span>
                ),
                sorter: (a, b) => a.revenue - b.revenue,
              },
              {
                title: "Orders",
                dataIndex: "orderCount",
                key: "orderCount",
                render: (value) => (
                  <Tag color="purple">{value.toLocaleString()}</Tag>
                ),
                sorter: (a, b) => a.orderCount - b.orderCount,
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );

  const totalRevenue = calculateRevenue(filteredOrders);

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", margin: 0 }}>Admin Dashboard</h1>
          <RangePicker
            defaultValue={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={totalRevenue / 1000000}
                precision={2}
                prefix={<DollarCircleOutlined />}
                suffix="M"
                valueStyle={{ color: "#3f8600" }}
              />
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "8px" }}
              >
                {dateRange[0].format("MMM D")} -{" "}
                {dateRange[1].format("MMM D, YYYY")}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={filteredOrders.length}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "8px" }}
              >
                {dateRange[0].format("MMM D")} -{" "}
                {dateRange[1].format("MMM D, YYYY")}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Fish Sold"
                value={calculateTotalFishSold()}
                valueStyle={{ color: "#722ed1" }}
              />
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "8px" }}
              >
                {dateRange[0].format("MMM D")} -{" "}
                {dateRange[1].format("MMM D, YYYY")}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={customers.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
        {/* Customer Tiers Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Customer Tiers">
              <Row gutter={16}>
                {[0, 1, 2, 3].map((tier) => (
                  <Col key={tier} xs={24} sm={12} md={6}>
                    <Statistic
                      title={`Tier ${tier} Customers`}
                      value={customers.filter((c) => c.tier === tier).length}
                      valueStyle={{
                        color: ["#595959", "#1890ff", "#52c41a", "#722ed1"][
                          tier
                        ],
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Order Status Distribution">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Pie
                    data={getOrderStatusDistribution()}
                    angleField="count"
                    colorField="status"
                    radius={0.8}
                    color={({ status }) => statusColors[status]}
                    label={false} // Remove labels completely
                    legend={{
                      position: "top",
                      flipPage: false,
                    }}
                    tooltip={{
                      formatter: (datum) => {
                        return {
                          name: datum.status,
                          value: `${datum.count} orders`,
                        };
                      },
                    }}
                    height={300}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Table
                    dataSource={getOrderStatusDistribution()}
                    pagination={false}
                    columns={[
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => (
                          <Tag
                            color={
                              status === "Completed"
                                ? "processing"
                                : status === "Paid"
                                ? "warning"
                                : status === "Cancelled"
                                ? "error"
                                : "default"
                            }
                            style={{
                              backgroundColor: statusColors[status],
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                            }}
                          >
                            {status}
                          </Tag>
                        ),
                      },
                      {
                        title: "Count",
                        dataIndex: "count",
                        key: "count",
                        sorter: (a, b) => a.count - b.count,
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Orders Daily">
              <Column
                data={processOrdersData(filteredOrders)}
                xField="date"
                yField="orders"
                meta={{
                  date: { alias: "Date" },
                  orders: { alias: "Orders" },
                }}
                color="#1890ff"
                label={{
                  position: "top",
                  style: {
                    fontSize: 12,
                  },
                }}
                xAxis={{
                  label: {
                    formatter: (v) => dayjs(v).format("MMM DD"),
                  },
                }}
                tooltip={{
                  formatter: (datum) => {
                    return {
                      name: "Orders",
                      value: datum.orders,
                    };
                  },
                }}
                height={300}
              />
            </Card>
          </Col>
        </Row>
        {fishSection}
      </Space>
    </div>
  );
};

export default AdminDashboard;
