import React, { useState, useEffect, useRef } from "react";
import us from "../../assets/US.svg";
import vn from "../../assets/VN.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.scss";

type LangType = "en" | "vi";

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<LangType>(() => {
    const savedLang = localStorage.getItem("lang") as LangType;
    return savedLang || "en";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleChoose = (newLang: LangType) => {
    if (i18n.changeLanguage) {
      i18n.changeLanguage(newLang);
    }
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  }, [i18n, lang]);

  return (
    <div className="language-selector relative" ref={dropdownRef}>
      <button
        className="language-selector-button flex items-center gap-2"
        onClick={toggleMenu}
      >
        <img
          className="flag-icon"
          src={lang === "vi" ? vn : us}
          alt="current language"
        />
        <span className="language-text">{lang === "vi" ? "VI" : "EN"}</span>
        <FontAwesomeIcon icon={faGlobe} className="globe-icon" />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <button
            className="language-option flex items-center"
            onClick={() => handleChoose("en")}
          >
            <img src={us} className="flag-icon" alt="English (US)" />
            <span>{t("language.english", "English (US)")}</span>
          </button>
          <button
            className="language-option flex items-center"
            onClick={() => handleChoose("vi")}
          >
            <img src={vn} className="flag-icon" alt="Việt Nam (VI)" />
            <span>{t("language.vietnamese", "Việt Nam (VI)")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
