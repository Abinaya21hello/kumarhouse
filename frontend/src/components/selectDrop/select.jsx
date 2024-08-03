import React, { useEffect, useState } from "react";
import "../selectDrop/select.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom"; // Import Link

const Select = ({ placeholder, icon }) => {
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedItem, setSelectedItem] = useState(placeholder);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("api/getProducts");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };

  const closeSelect = (name) => {
    setIsOpenSelect(false);
    setSelectedItem(name);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpenSelect(false)}>
      <div className="selectDropWrapper">
        {icon}
        <span className="openSelect" onClick={openSelect}>
          {selectedItem.length > 14
            ? selectedItem.substr(0, 14) + "..."
            : selectedItem}
          <KeyboardArrowDownIcon className="arrow" />
        </span>
        {isOpenSelect && (
          <div className="selectDrop">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <ul className="searchResults">
                <li
                  key={0}
                  onClick={() => closeSelect(placeholder)}
                  className={`searchItem ${
                    selectedItem === placeholder ? "active" : ""
                  }`}
                >
                  {placeholder}
                </li>
                {categories.map((category, catIndex) => (
                  <li
                    key={catIndex + 1}
                    className="searchItem categoryItem"
                    onMouseEnter={() => setHoveredCategory(catIndex)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {category.category}
                    {hoveredCategory === catIndex && (
                      <ul className="modelDropdown">
                        {category.models.map((model) => (
                          <li key={model._id} className="modelItem">
                            <Link
                              to={`products/${category._id}/models/${model._id}`}
                              className="modelContainer"
                              onClick={() => closeSelect(model.mainProduct)}
                            >
                              {model.mainProduct}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Select;