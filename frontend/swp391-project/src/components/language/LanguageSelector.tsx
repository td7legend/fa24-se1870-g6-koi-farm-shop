import React, { useState, useEffect, useRef } from "react";
import us from "../../assets/US.svg";
import vn from "../../assets/VN.svg";
import down from "../../assets/chevron-down.svg";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css"; // Assuming you have this CSS file

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
    <div
      className="translate relative inline-flex flex-row-reverse"
      ref={dropdownRef}
    >
      <button
        className="language-selector-button-1 py-2 px-4 inline-flex items-center gap-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-28 mr-2"
        onClick={toggleMenu}
      >
        <img
          className="w-5 h-auto rounded-full"
          src={lang === "vi" ? vn : us}
          alt="current language"
        />
        <span className="font-medium truncate">
          {lang === "vi" ? "VI" : "EN"}
        </span>
        <img
          src={down}
          className={`w-4 transform ${isOpen ? "rotate-180" : ""}`}
          alt="chevron-down"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-40 bg-white shadow-lg rounded-lg py-2 mt-1 z-50">
          <button
            className="language-selector-button flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none w-full"
            onClick={() => handleChoose("en")}
          >
            <img src={us} className="w-4 rounded-full" alt="English (US)" />
            <span>{t("language.english", "English (US)")}</span>
          </button>
          <button
            className="language-selector-button flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 w-full"
            onClick={() => handleChoose("vi")}
          >
            <img src={vn} className="w-4 rounded-full" alt="Việt Nam (VI)" />
            <span>{t("language.vietnamese", "Việt Nam (VI)")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
