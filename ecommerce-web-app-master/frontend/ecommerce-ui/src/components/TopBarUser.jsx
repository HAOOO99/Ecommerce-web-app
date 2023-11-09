import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


function TopBarUser() {
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);
    const navigate = useNavigate();

    const handleBackToMain = () =>{
        navigate('/')
    }

    function handleLogOut() {
        removeCookie("email", {path: '/'});
        removeCookie("shoppingCart",{path:'/'});
        removeCookie("userId",{path:'/'});
        removeCookie("userFirstName",{path:'/'});
        removeCookie("userLastName",{path:'/'});
        handleBackToMain();
    }

    function handleBack() {
        handleBackToMain();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" sx={{
                //   bgcolor:"blue"    // TODO -> what color?
            }}>
                <Toolbar>
                    <IconButton aria-label='back' onClick={handleBack}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>

                    {/* Left Place Holder  */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        SellPhone
                    </Typography>

                    {/* Right Place Holder  */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            variant='contained'
                            color='secondary'
                            startIcon={<LogoutIcon />}
                            onClick={handleLogOut}
                            sx={{
                                my: 1,
                                mx: 1
                            }}
                        >
                            Log Out
                        </Button>

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopBarUser;