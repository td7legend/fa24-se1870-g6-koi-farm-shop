import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import config from "../../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Import icon search
import "./index.scss";

const EnhancedSearchBar = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fishes, setFishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
      } catch (error) {
        console.error("Error fetching fishes:", error);
      }
    };
    fetchFishes();
  }, []);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return fishes.filter((fish) =>
      fish.name.toLowerCase().includes(inputValueLowerCase)
    );
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div>
      <strong>{suggestion.name}</strong> - {suggestion.breed}
    </div>
  );

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    navigate(`/fish/${suggestion.fishId}`);
  };

  const handleSearch = () => {
    if (value.trim()) {
      navigate(`/fish-page?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const inputProps = {
    placeholder: "Search Fish",
    value,
    onChange: onChange,
  };

  return (
    <div
      className="search-bar"
      style={{ zIndex: "1003", position: "relative" }}
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      <button
        onClick={handleSearch}
        style={{ margin: "0", display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: "5px" }} />
        Search
      </button>
    </div>
  );
};

export default EnhancedSearchBar;
