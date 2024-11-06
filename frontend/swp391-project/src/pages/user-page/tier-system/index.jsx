import React, { useState, useEffect } from "react";
import { Card, Progress, Typography, Row, Col, Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { GiCrown, GiLaurelCrown, GiTrophy } from "react-icons/gi";
import { AiFillGift, AiFillStar, AiFillCustomerService } from "react-icons/ai";
import { BsFillPersonFill, BsTrophy } from "react-icons/bs";
import { MdEventAvailable, MdNewReleases } from "react-icons/md";
import { FaBirthdayCake, FaPercent, FaGem, FaCrown } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";
import "./index.scss";

const { Title, Text } = Typography;

const TierSystem = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const tiers = [
    {
      name: "Bronze",
      points: 0,
      multiplier: 1,
      icon: GiLaurelCrown,
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #804A00, #CD7F32, #b08d57)",
      benefits: "Basic rewards and member benefits",
    },
    {
      name: "Silver",
      points: 100,
      multiplier: 2,
      icon: GiTrophy,
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #5D6874, #8E9EAB, #B8C6DB)",
      benefits: "2x points on all purchases",
    },
    {
      name: "Gold",
      points: 200,
      multiplier: 3,
      icon: GiCrown,
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #B8860B, #FFD700, #FFF380)",
      benefits: "3x points and exclusive offers",
    },
    {
      name: "Platinum",
      points: 500,
      multiplier: 5,
      icon: FaCrown,
      color: "#E5E4E2",
      gradient: "linear-gradient(135deg, #1a1a1a, #363636, #727272, #a6a6a6)",
      benefits: "5x points and VIP privileges",
    },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [token]);

  const getCurrentTierIndex = () => {
    if (!userInfo) return 0;
    return userInfo.tier || 0;
  };

  const calculateProgress = () => {
    const currentTierIndex = getCurrentTierIndex();
    const currentPoints = userInfo?.accommodatePoint || 0;

    if (currentTierIndex >= tiers.length - 1) return 100;

    const nextTierPoints = tiers[currentTierIndex + 1].points;
    const currentTierPoints = tiers[currentTierIndex].points;
    const progress =
      ((currentPoints - currentTierPoints) /
        (nextTierPoints - currentTierPoints)) *
      100;

    return Math.min(Math.max(Math.round(progress), 0), 100);
  };

  const getPointsToNextTier = () => {
    const currentTierIndex = getCurrentTierIndex();
    if (currentTierIndex >= tiers.length - 1) return 0;

    const currentPoints = userInfo?.accommodatePoint || 0;
    const nextTierPoints = tiers[currentTierIndex + 1].points;
    return Math.max(nextTierPoints - currentPoints, 0);
  };

  const getMoneyNeededForNextTier = () => {
    const pointsNeeded = getPointsToNextTier();
    const currentTierIndex = getCurrentTierIndex();
    const multiplier = tiers[currentTierIndex].multiplier;
    return (pointsNeeded * 100000) / multiplier;
  };

  return (
    <div className="tier-system">
      <Breadcrumb className="breadcrumb" separator=">">
        <Breadcrumb.Item href="/">
          <FontAwesomeIcon icon={faHome} />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/user-dashboard/:id">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Tier System</Breadcrumb.Item>
      </Breadcrumb>

      <div className="tier-container">
        <Title level={2} className="main-title">
          <FaGem className="title-icon" />
          Loyalty Tier System
        </Title>

        <Row gutter={[24, 24]}>
          {tiers.map((tier, index) => {
            const TierIcon = tier.icon;
            const isCurrentTier = getCurrentTierIndex() === index;
            return (
              <Col xs={24} sm={12} md={6} key={tier.name}>
                <Card
                  className={`tier-card ${isCurrentTier ? "current" : ""}`}
                  style={{
                    background: tier.gradient,
                  }}
                >
                  <div className="tier-content">
                    <div className="tier-icon-wrapper">
                      <TierIcon className="tier-icon" />
                    </div>
                    <Title level={3} className="tier-name">
                      {tier.name}
                    </Title>
                    <div className="tier-details">
                      <div className="points-required">
                        <span className="label">Points Required</span>
                        <span className="value">{tier.points}</span>
                      </div>
                      <div className="multiplier">
                        <span className="label">Points Multiplier</span>
                        <span className="value">x{tier.multiplier}</span>
                      </div>
                      <div className="benefits">
                        <span className="label">Benefits</span>
                        <span className="value">{tier.benefits}</span>
                      </div>
                    </div>
                  </div>
                  {isCurrentTier && (
                    <div className="current-badge">Current Tier</div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        {userInfo && (
          <Card className="progress-card">
            <div className="progress-header">
              <Title level={3} className="progress-title">
                <AiFillStar
                  className="section-icon"
                  style={{ color: "#bbab6f" }}
                />
                Your Current Progress
              </Title>

              <div className="status-labels">
                <span className="label">Current Tier</span>
                <span className="label">Total Points</span>
              </div>

              <div className="current-status">
                <div className="status-item">
                  <span className="value">
                    <FaCrown className="tier-icon" />
                    {tiers[getCurrentTierIndex()].name}
                  </span>
                </div>
                <div className="status-item">
                  <span className="value">
                    <AiFillStar className="points-icon" />
                    {userInfo.accommodatePoint} points
                  </span>
                </div>
              </div>
            </div>

            {getCurrentTierIndex() < tiers.length - 1 && (
              <div className="progress-section">
                <div className="progress-info">
                  <span className="current-tier-name">
                    {tiers[getCurrentTierIndex()].name}
                  </span>
                  <span className="next-tier-name">
                    {tiers[getCurrentTierIndex() + 1].name}
                  </span>
                </div>
                <Progress
                  percent={Math.round(calculateProgress())}
                  status="active"
                  strokeColor={{
                    "0%": "#bbab6f",
                    "100%": "#a08d4a",
                  }}
                  strokeWidth={15}
                  className="custom-progress"
                />
                <div className="progress-details">
                  <div className="points-needed">
                    <FaGem className="details-icon" />
                    <div className="details-text">
                      <span className="label">Points needed for next tier</span>
                      <span className="value">
                        {getPointsToNextTier()} points
                      </span>
                    </div>
                  </div>
                  <div className="purchase-needed">
                    <FaPercent className="details-icon" />
                    <div className="details-text">
                      <span className="label">Estimated purchase needed</span>
                      <span className="value">
                        {getMoneyNeededForNextTier().toLocaleString()} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        <Card className="benefits-card">
          <Title level={3}>
            <AiFillGift className="section-icon" />
            Tier Benefits
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="benefits-section">
                <div className="benefits-content">
                  <Title level={4}>
                    <BsFillPersonFill className="benefit-icon" />
                    Basic Benefits (All Tiers)
                  </Title>
                  <ul>
                    <li>
                      <FaPercent className="list-icon" /> Points accumulation on
                      all purchases
                    </li>
                    <li>
                      <AiFillGift className="list-icon" /> Access to exclusive
                      products
                    </li>
                    <li>
                      <FaBirthdayCake className="list-icon" /> Birthday special
                      offers
                    </li>
                    <li>
                      <MdNewReleases className="list-icon" /> Regular
                      promotional updates
                    </li>
                  </ul>
                </div>
                <div className="large-icon-wrapper">
                  <GiLaurelCrown className="large-benefit-icon" />
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="benefits-section premium">
                <div className="benefits-content">
                  <Title level={4}>
                    <BsTrophy className="benefit-icon" />
                    Premium Benefits (Platinum)
                  </Title>
                  <ul>
                    <li>
                      <AiFillStar className="list-icon" /> 5x points on all
                      purchases
                    </li>
                    <li>
                      <AiFillCustomerService className="list-icon" /> Priority
                      customer service
                    </li>
                    <li>
                      <MdNewReleases className="list-icon" /> Early access to
                      new products
                    </li>
                    <li>
                      <MdEventAvailable className="list-icon" /> Exclusive
                      Platinum member events
                    </li>
                  </ul>
                </div>
                <div className="large-icon-wrapper">
                  <FaCrown className="large-benefit-icon" />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default TierSystem;
