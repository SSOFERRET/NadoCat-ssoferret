import React, { useState } from "react";
import "../../../styles/scss/components/missing/customSelect.scss";

interface CustomSelectProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  label,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      {label && <label htmlFor={id}>{label}</label>}
      <div id={id} className="select-box" onClick={handleToggleDropdown}>
        {selectedValue || placeholder}
      </div>
      {isOpen && (
        <ul className="options">
          {options.map((option, index) => (
            <li
              key={index}
              className="option"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
