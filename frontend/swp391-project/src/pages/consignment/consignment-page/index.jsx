import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ConsignmentCare from "../../../components/consignment-care";
import ConsignmentSell from "../../../components/consignment-sell";
import ConsignmentIntroduce from "../../../components/consignment-introduce";
import FadeInSection from "../../../components/fadein";
import "./index.scss";

function Consignment() {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState([false, false, false]);
  const sectionRefs = useRef([]);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      const index = sectionRefs.current.indexOf(entry.target);
      if (entry.isIntersecting) {
        setVisibility((prev) => {
          const newVisibility = [...prev];
          newVisibility[index] = true;
          return newVisibility;
        });
      } else {
        setVisibility((prev) => {
          const newVisibility = [...prev];
          newVisibility[index] = false;
          return newVisibility;
        });
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="consignment-page">
      <FadeInSection
        ref={(el) => (sectionRefs.current[0] = el)}
        isVisible={visibility[0]}
      >
        <ConsignmentIntroduce />
      </FadeInSection>
      <FadeInSection
        ref={(el) => (sectionRefs.current[1] = el)}
        isVisible={visibility[1]}
      >
        <ConsignmentCare />
      </FadeInSection>
      <FadeInSection
        ref={(el) => (sectionRefs.current[2] = el)}
        isVisible={visibility[2]}
      >
        <ConsignmentSell />
      </FadeInSection>
    </div>
  );
}

export default Consignment;
