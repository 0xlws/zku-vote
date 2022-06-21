import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
// import PollIcon from "@mui/icons-material/Poll";
// import QueryStatsIcon from "@mui/icons-material/QueryStats";
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { PageContext } from "../contexts/PageContext";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext } from "react";

const drawerWidth = 60;

const pages = [
  { name: "Students", icon: <ThumbUpIcon />, page: "0" },
  { name: "Proposals", icon: <HowToVoteIcon />, page: "1" },
];
// const pages2 = [
//   { name: "Statistics", icon: <PollIcon />, page: "" },
//   { name: "Data", icon: <QueryStatsIcon />, page: "" },
//   { name: "Gas", icon: <LocalGasStationIcon />, page: "" },
// ];

const empty = [{ name: "", icon: "", page: "" }];

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { setPage } = useContext(PageContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (page: string) => {
    setPage(page);
    // console.log("page to:", page);
    localStorage.setItem("page", page);
  };

  const drawer = (
    <div style={{ overflow: "hidden" }}>
      <Divider />
      <List>
        {pages.map((d, index) => (
          <Tooltip key={index} title={d.name} placement="right" arrow>
            <ListItem key={d.name} disablePadding>
              <ListItemButton onClick={() => handleClick(d.page)}>
                <ListItemIcon>{d.icon}</ListItemIcon>
                <ListItemText primary={d.name} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          height: "100vh",
        }}
      >
        {empty.map((d, index) => (
          <Tooltip key={index} title={d.name}>
            <ListItem key={d.name} disablePadding>
              <ListItemButton component="a" href={d.page}>
                <ListItemIcon>{d.icon}</ListItemIcon>
                <ListItemText primary={d.name} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ zIndex: 1203, display: "flex" }}>
      <CssBaseline />
      <Box
        sx={{
          zIndex: 1202,
          position: "fixed",
          left: 0,
          fontSize: "large",
          color: "#666",
          marginLeft: "1.9rem",
          marginTop: "0.6rem",
          transform: "scale(1.5)",
          display: { sm: "none" },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          //   container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
