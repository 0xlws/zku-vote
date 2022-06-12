import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const options = ["Most helpful student", "*Some other campaign*"];

export default function CheckboxList(props: {
  setArrFunc: (arg0: (string | boolean)[]) => void;
}) {
  const [checked, setChecked] = React.useState<number>(-1);

  const handleToggle = (value: string, index: number) => {
    setChecked(index);
    props.setArrFunc([value, true]);
  };

  return (
    <List sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}>
      {options.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => handleToggle(value, index)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={[checked].indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={` ${value}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
