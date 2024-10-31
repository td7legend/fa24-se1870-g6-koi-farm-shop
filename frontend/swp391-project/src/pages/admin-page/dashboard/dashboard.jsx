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
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import config from "../../../config/config";

const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [allOrders, setAllOrders] = useState([]); // Store all orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Store filtered orders
  const [customers, setCustomers] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);

  // Function to fetch revenue data
  const fetchRevenue = async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `${config.API_ROOT}Revenue/total?startDate=${startDate.format(
          "YYYY-MM-DD"
        )}&endDate=${endDate.format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRevenue(response.data.totalRevenue);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      message.error("Failed to fetch revenue data");
    }
  };

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

  // Filter orders by date range
  const filterOrdersByDateRange = (orders, startDate, endDate) => {
    const filtered = orders.filter((order) => {
      const orderDate = dayjs(order.orderDate);
      return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
    });
    setFilteredOrders(filtered);
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
    setLoading(true);

    try {
      // Update all statistics with new date range
      await fetchRevenue(dates[0], dates[1]);
      filterOrdersByDateRange(allOrders, dates[0], dates[1]);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      message.error("Failed to update dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          fetchRevenue(dateRange[0], dateRange[1]),
          fetchOrders(),
          fetchCustomers(),
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
        <Spin size="large" />
      </div>
    );
  }

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
                value={revenue / 1000000}
                prefix={<DollarCircleOutlined />}
                suffix="M VNĐ"
                valueStyle={{ color: "#3f8600" }}
              />
              <div className="text-xs text-gray-500 mt-2">
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
              <div className="text-xs text-gray-500 mt-2">
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
              <div className="text-xs text-gray-500 mt-2">
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
      </Space>
    </div>
  );
};

export default AdminDashboard;
