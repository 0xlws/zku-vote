import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SortedList from "./SortedList";
import CheckboxList from "./CheckboxList";

import { useState } from "react";

//



export default function ControlledAccordions({
  props,
  userId,
  giveVote,
  candidates,
}: any) {

  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [arr, setArr] = useState<(string | boolean)[]>([
    "Choose a campaign",
    false,
  ]);

  if (arr[1]) {
    setExpanded("panel2");
    const newArr = [...arr];
    newArr[1] = false;
    setArr(newArr);
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Step 1.</Typography>
          <div>
            <Typography sx={{ color: "text.secondary" }}>{arr[0]}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxList setArrFunc={setArr} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Step 2.</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Choose a candidate
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SortedList
            userId={userId}
            arr={arr}
            candidates={candidates}
            giveVote={giveVote}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
