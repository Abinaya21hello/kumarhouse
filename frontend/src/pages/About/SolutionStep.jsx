import React from "react";
import { SvgIcon } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SolutionStep(props) {
  return (
    <div className="about-text-step">
      <p className="about-text-sTitle">
        <span>
          <SvgIcon component={ExpandMoreIcon} className="mui-icon" />{" "}
          {props.title}
        </span>
      </p>
      <p className="about-text-description">{props.description}</p>
    </div>
  );
}

export default SolutionStep;
