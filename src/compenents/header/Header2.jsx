import { ExpandMore, ShoppingCartOutlined } from "@mui/icons-material";
import { Container, IconButton, Stack, Typography, useTheme, Popover, Box, Divider, Badge, Tooltip, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
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
    width: '266px',
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
    const [existingOrder, setExistingOrder] = useState(null);
    const [localOrderData, setLocalOrderData] = useState(null);

    useEffect(() => {
        // Retrieve local order data from local storage when component mounts
        const storedLocalOrderData = localStorage.getItem('orderData');
        if (storedLocalOrderData) {
            setLocalOrderData(JSON.parse(storedLocalOrderData));
        }
    }, []);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };
    const handleOrderSubmit = async () => {
        if (!localOrderData || !localOrderData.items || localOrderData.items.length === 0) {
            console.error('No local orders to submit');
            return;
        }

        const totalPrice = localOrderData.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

        const data = {
            username: 'zear', // Replace with actual username
            email: localOrderData.user.email, // Use actual email from localOrderData
            phone: localOrderData.user.phoneNumber, // Use actual phone number from localOrderData
            products: localOrderData.items.map(item => ({
                product: item.productId.attributes?.productTitle || "NAN",
                quantity: item.quantity,
            })),
            totalprice: totalPrice // Use calculated total price
        };

        console.log('Submitting order data:', { data });

        try {
            const response = await axios.post('http://localhost:5555/api/baskets', { data });

            if (response.status === 200) {
                console.log('Order placed successfully:', response.data);

                // Remove products list from local storage
                const storedLocalOrderData = localStorage.getItem('orderData');
                if (storedLocalOrderData) {
                    const parsedData = JSON.parse(storedLocalOrderData);
                    parsedData.items = []; // Remove products list
                    localStorage.setItem('orderData', JSON.stringify(parsedData));
                }

                // Refresh the page
                window.location.reload();
            } else {
                console.error('Failed to place order:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };



    useEffect(() => {
        // Fetch order data from server if user email is available
        const fetchOrderData = async () => {
            try {
                const email = localOrderData?.user?.email; // Get email from localOrderData
                if (email) {
                    const response = await axios.get(`http://localhost:5555/api/baskets/email/${email}`);
                    if (response.data) {
                        setExistingOrder(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        if (localOrderData) {
            fetchOrderData();
        }
    }, [localOrderData]); // Dependency array ensures fetchOrderData is called after localOrderData is set

    const theme = useTheme();

    return (
        <Container sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
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
                    <Badge badgeContent={(orderData?.items?.length || 0) + (localOrderData?.items?.length || 0)} color="primary">
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Existing Orders</Typography>
                    {existingOrder ? (
                        <>
                            <Box key={existingOrder.id} sx={{ mb: 2 }}>
                                <Typography variant="body2">Order ID: {existingOrder.id}</Typography>
                                <Typography variant="body2">status: {existingOrder.submitted ? "packed" : "un_packed"}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography>Total: {existingOrder.totalprice} DT</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body2">No existing orders found.</Typography>
                    )}

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>New Orders</Typography>
                    {localOrderData?.items ? (
                        <>
                            {localOrderData.items.map((item, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Product Name: {item?.productId?.attributes?.productTitle}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>Quantity: {item.quantity}</Typography>
                                        <Typography>Total: {item.totalPrice} DT</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Typography variant="body2">No local orders found.</Typography>
                    )}
                </Box>
                <Box sx={{ p: 1 }}>
                    {localOrderData?.items && <Button variant="contained" color="primary" onClick={handleOrderSubmit}>Submit Order</Button>}
                </Box>
            </Popover>
        </Container>
    );
};

export default Header2;
