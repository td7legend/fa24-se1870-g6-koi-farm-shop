import { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";
import { useSelector } from "react-redux";
import { Drawer, List, Typography, Button } from "antd";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";
import "../../drawer/index.scss";
import "../../breadcrumb-user/index.scss";
const { Text } = Typography;

function Layout() {
  const { pathname } = useLocation();
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const { cartItemsRedux } = useSelector((state) => state.cart);
  const { t } = useTranslation();
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };

    fetchFishes();
  }, []);

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    console.log(`Looking for fishId: ${fishId}`);
    console.log(`Found fish:`, fish);
    return fish ? fish.price : 0;
  };

  const calculateTotal = () => {
    return cartItemsRedux.reduce((total, item) => {
      const price = getFishPrice(item.fishId);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div>
      <div className={cartDrawerVisible ? "blur-background" : ""}>
        <Header setCartDrawerVisible={setCartDrawerVisible} />
        <Outlet />
        <Footer />
      </div>

      <Drawer
        title={t("yourCart")}
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        open={cartDrawerVisible}
        width={400}
        style={{ fontSize: "20px" }}
      >
        <List
          itemLayout="horizontal"
          dataSource={cartItemsRedux}
          renderItem={(item) => {
            const price = getFishPrice(item.fishId);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img src={item.imageUrl} width={50} alt={item.fishName} />
                  }
                  title={item.fishName}
                  description={`${t("quantity")}: ${item.quantity}`}
                />
                <div>
                  <Text>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(price * item.quantity)}
                  </Text>
                </div>
              </List.Item>
            );
          }}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Text strong>
            {t("total")}:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(calculateTotal())}
          </Text>
        </div>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button type="primary" onClick={() => setCartDrawerVisible(false)}>
            {t("close")}
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => (window.location.href = "/cart")}
          >
            {t("viewFullCart")}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default Layout;
