import { useTheme } from "@emotion/react";
// @ts-ignore
import { KeyboardArrowRightOutlined, Window, MenuOutlined, GirlOutlined, ManOutlined, ChildCareOutlined, HomeOutlined, WomanOutlined, HouseOutlined, ExpandMore, AirlineSeatFlatAngled } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { Button, Container, Menu, MenuItem, Typography, Box, IconButton, ListItemIcon, ListItemText, Drawer, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemButton, useMediaQuery, Stack } from "@mui/material";
import React from "react";
import Links from "./links";
// Déclaration de la fonction anonyme
const anonymousFunction = function () {
    console.log("Ceci est une fonction anonyme.");
}

const Header3 = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme()
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor, open) =>
            (event) => {
                if (
                    event.type === 'keydown' &&
                    (event.key === 'Tab') ||
                    (event.key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };
    return (
        <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 5, }}>

            {useMediaQuery('(min-width:1200px)') && (<Stack gap={4} direction="row" alignItems={"center"}>
                <Links title={"Home"} />

                <Links title={"User Account"} />
                <Links title={"Vendor Account"} /></Stack>)}



            {useMediaQuery('(max-width:1200px)') && (<IconButton onClick={toggleDrawer("top", true)}>
                <MenuOutlined />
            </IconButton>)}
            <Drawer

                anchor={"top"}
                open={state["top"]}
                onClose={toggleDrawer("top", false)}
                sx={{ ".MuiPaper-root.css-1sozasi-MuiPaper-root-MuiDrawer-paper": { height: "100%" } }}
            >
                aaaaaaaaaaa
                <Box sx={{ Width: 444, mx: "auto", mt: 6, position: "relative", pt: 10 }}>
                    <IconButton sx={{
                        ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
                        position: "absolute",
                        top: 0, right: 10
                    }}
                        onClick={toggleDrawer("top", false)}>
                        <CloseIcon />
                    </IconButton>
                    {[{ mainLink: "Home", subLink: ["Link1", "Link2", "Link3"] },
                    { mainLink: "Mega Menu", subLink: ["Link1", "Link2", "Link3"] },
                    { mainLink: "full screen menu", subLink: ["Link1", "Link2", "Link3"] },
                    { mainLink: "pages", subLink: ["Link1", "Link2", "Link3"] },
                    { mainLink: "user account", subLink: ["Link1", "Link2", "Link3"] },
                    { mainLink: "vendor account", subLink: ["Link1", "Link2", "Link3"] },].map((item) => {
                        return (
                            <Accordion key={item.mainLink} elevation={0} sx={{ bgcolor: "initial" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>{item.mainLink} </Typography>
                                </AccordionSummary>

                                <List sx={{ py: 0, my: 0 }}>
                                    {item.subLink.map((link) => {
                                        return (
                                            <ListItem key={link} sx={{ py: 0, my: 0 }}>
                                                <ListItemButton>
                                                    <ListItemText primary={link} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Accordion>
                        )
                    })
                    }
                </Box>
            </Drawer>
        </Container >
    );
};
export default Header3;