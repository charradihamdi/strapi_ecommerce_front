import { ExpandMore, ShoppingCart, ShoppingCartOutlined } from "@mui/icons-material";
import { Container, IconButton, Stack, Typography, useTheme, Popover, Box, Divider, Badge, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useState, useEffect } from "react";
import axios from 'axios';

const Search = styled('div')(({ theme }) => ({
    flexGrow: 0.4,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: "1px solid #777",
    '&:hover': {
        border: "1px solid #333",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    Width: '266px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '330px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: "#777",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const options = ["All categories", "Women", "Man", "Baby", "House"];

const Header2 = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [orderData, setOrderData] = useState(null);
    console.log({ orderData });

    useEffect(() => {
        // Retrieve order data from local storage when component mounts
        const storedOrderData = localStorage.getItem('orderData');
        if (storedOrderData) {
            setOrderData(JSON.parse(storedOrderData));
        }

        // Fetch order data from server
        const fetchOrderData = async () => {
            try {
                // Replace 'email' with the actual email address
                const email = 'example@example.com'; // Replace with the actual email address
                const response = await axios.get(`http://localhost:1337/orders?email=${email}`);
                if (response.data && response.data.status !== undefined) {
                    setOrderData(response.data);
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, []);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    const theme = useTheme();
    return (
        <Container sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
            <>
                <Stack alignItems={"center"}>
                    <ShoppingCartOutlined />
                    <Typography variant="body2">Clean City</Typography>
                </Stack>

                <Stack direction={"row"} alignItems={"center"}>
                    <Tooltip title="Order Information" arrow>
                        <IconButton>
                            <Person2OutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton
                        aria-label="cart"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    >
                        <Badge badgeContent={orderData?.items?.length || 0} color="primary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Stack>

                <Popover
                    sx={{ marginTop: 7 }}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    disableRestoreFocus
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <Box sx={{ p: 1, width: 300 }}>
                        <Typography variant="h6">Order Summary</Typography>
                        {orderData?.items ? (
                            <>
                                {orderData.items.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Product Name: {item.productId.attributes.productTitle}</Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography>Quantity: {item.quantity}</Typography>
                                            <Typography>Total: {item.totalPrice} DT</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                    </Box>
                                ))}
                                <Typography variant="body2">Email: {orderData.user.email}</Typography>
                                <Typography variant="body2">Phone: {orderData.user.phoneNumber}</Typography>
                                <Typography variant="body2">City: {orderData.user.city}</Typography>
                            </>
                        ) : (
                            <Typography variant="body2">No orders found.</Typography>
                        )}
                    </Box>
                </Popover>
            </>
        </Container>
    );
};

export default Header2;
