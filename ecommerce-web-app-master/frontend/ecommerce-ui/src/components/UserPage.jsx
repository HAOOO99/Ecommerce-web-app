import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyIcon from '@mui/icons-material/Key';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CommentIcon from '@mui/icons-material/Comment';

import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { deepOrange } from '@mui/material/colors';
import TopBarUser from "./TopBarUser";
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';

import UserEditComponent from './UserChangeName';
import UserPassword from './UserPassword';
import UserChangeEmail from './UserChangeEmail';
import UserComment from './UserComment';
import UserListingComponent from './UserListing';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';

const theme = createTheme({
    palette: {
        primary: {
            main: deepOrange[500],
        },
    },
});


function UserPage() {
    const [tab, setTab] = React.useState(1);
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart']);
    const navigate = useNavigate();

    React.useEffect(() => {
        // Check if the page is visited by raw url
        if (cookies.email === undefined){
            alert('Please Log In First!');
            navigate('../login');
        }
    }, []);

    function Adapter() {
        switch (tab) {
            case 1:
                return (
                    <UserEditComponent></UserEditComponent>
                );
            case 2:
                return (
                    <UserChangeEmail></UserChangeEmail>
                );
            case 3:
                return (
                    <UserPassword></UserPassword>
                );
            case 4:
                return (
                    <UserListingComponent></UserListingComponent>
                );
            case 5:
                return (
                    <UserComment></UserComment>
                );
            default: 
                return null;
        }
    }

    function NavBar() {
        return (
            <List componentt="nav">
                <React.Fragment>
                    <ListItemButton onClick={() => setTab(1)}>
                        <ListItemIcon>
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit Profile" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setTab(2)}>
                        <ListItemIcon>
                            <EmailIcon />
                        </ListItemIcon>
                        <ListItemText primary="Change Email" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setTab(3)}>
                        <ListItemIcon>
                            <KeyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Change Password" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setTab(4)}>
                        <ListItemIcon>
                            <PhoneAndroidIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Listings" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setTab(5)}>
                        <ListItemIcon>
                            <CommentIcon />
                        </ListItemIcon>
                        <ListItemText primary="View Comments" />
                    </ListItemButton>

                </React.Fragment>
            </List>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <CssBaseline></CssBaseline>
                <TopBarUser></TopBarUser>
                <Grid container direction="row" component="main" sx={{ height: '100vh'}}>
                    <Grid item 
                        xs={2}
                        sm={2}
                        md={2}
                        bgcolor={deepOrange[200]} // A Bit Hardcore
                    >
                        <NavBar></NavBar>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10}>
                        <Box>
                            <Adapter></Adapter>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default UserPage;