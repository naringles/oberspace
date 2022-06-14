import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { FilterContext } from "./SearchContext";

import { Card, Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
function FolderChoices() {
  const FolderNames = [
    "PDF",
    "WordDocument",
    "PowerPoint",
    "Application",
    "Audio",
    "Image",
    "Video",
    "Others",
  ];
  const { filterVal, setFilterVal } = useContext(FilterContext);
  const handleSelect = (event) => {
    setFilterVal(event.target.innerText);
  };
  return (
    <Dropdown id="dropdown-custom-2" as={ButtonGroup} drop="right">
      <Dropdown.Toggle className="dropDToggle">파일 타입 선택</Dropdown.Toggle>
      <Dropdown.Menu className="menuColors">
        {FolderNames.map((folder, index) => (
          <Dropdown.Item
            key={index}
            className="dropDText"
            eventKey={`${index}`}
            onClick={handleSelect}
          >
            {" "}
            {folder}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default FolderChoices;
