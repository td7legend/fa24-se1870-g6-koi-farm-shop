import { useTranslation } from "react-i18next";
import "./index.scss";
import { Link } from "react-router-dom";

const OurService = () => {
  const { t } = useTranslation();
  return (
    <section className="our__service">
      <h2>{t("ourService")}</h2>
      <div className="service__content">
        <Link
          to="/consignment/care"
          className="service__box service__box--care"
        >
          <h3>{t("consignmentCare")}</h3>
          <p>
            {t(
              "ourConsignmentCareServiceEnsuresYourKoiFishAreHealthyAndWell-MaintainedWeOffer"
            )}
          </p>
          <ul>
            <li>{t("regularHealthChecksAndDiseasePrevention")}</li>
            <li>{t("customizedCarePlansForYourFish")}</li>
            <li>{t("high-qualityFeedingAndWaterMaintenance")}</li>
          </ul>
          <p className="learn-more">{t("learnMore")} →</p>
        </Link>

        <Link
          to="/consignment/sell"
          className="service__box service__box--sell"
        >
          <h3>{t("consignmentSell")}</h3>
          <p>
            {t(
              "ourConsignmentSellServiceConnectsYouWithTrustedBuyersKeyFeaturesInclude"
            )}
          </p>
          <ul>
            <li>{t("comprehensiveMarketAnalysisForFairPricing")}</li>
            <li>{t("wideNetworkOfDedicatedKoiFishBuyers")}</li>
            <li>{t("seamlessTransactionAndLogisticsSupport")}</li>
          </ul>
          <p className="learn-more">{t("learnMore")} →</p>
        </Link>
      </div>
    </section>
  );
};

export default OurService;
