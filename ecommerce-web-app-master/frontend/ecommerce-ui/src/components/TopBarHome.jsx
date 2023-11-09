import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";


const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 5,
  width: '100%',
  // if screen size is smaller than 600px -> full width
  // else ->  auto width & 3 unit away from web name text on left
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + size from searchIcon defined above
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',

    // if screen size is smaller than 960px -> full width
    // else ->  20ch    ch: widtth of '0'
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function TopBarHome() {

  const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);
  const [keyword, setKeyword] = React.useState("");
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
  };

  function handleSearch() {
      if (keyword.length === 0){
        alert("You will need to enter a keyword first!!!");
        navigate('/');
        return;
      }
      navigate({
        pathname: '/search',
        search: '?keyword=' + keyword,
    });
  }

  const handleProfile = () =>{
    if (cookies.email !== undefined) {
      navigate('/user');
    } else {
      navigate('/login');
    }
  }

  const handleLogInTransit = () =>{
      navigate('/login');
  }

  function handleLogIn() {
    handleLogInTransit();
  }

  function handleLogOut() {
    removeCookie("email", {path: '/'});
    removeCookie("shoppingCart",{path:'/'});
    removeCookie("userId",{path:'/'});
    removeCookie("userFirstName",{path:'/'});
    removeCookie("userLastName",{path:'/'});
    logout();
  }

  function handleCheckOut() {
    if (cookies.email === undefined){
      alert("Log In Before CheckOut");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }

  function LogInButtonGroup() {
    console.log("COOKIES: " + (cookies.email === undefined));
    if (cookies.email !== undefined) {
      return (
        <Box>

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

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfile}
            sx={{
              marginRight: 1
            }}
          >
            <AccountCircle fontSize='inherit' />
          </IconButton>
        </Box>
      )
    }
    return (
      <Box>
        <Button
          variant='contained'
          color='secondary'
          startIcon={<LogoutIcon />}
          onClick={handleLogIn}
          sx={{
            my: 1,
            mx: 1
          }}
        >
          Log In
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{
        //   bgcolor:"blue"    // TODO -> what color?
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            SellPhone
          </Typography>
          <SearchBox>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              onChange={(event) => setKeyword(event.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBox>
          <Button
            variant='contained'
            color='secondary'
            onClick={handleSearch}
            sx={{
              my: 1,
              mx: 1
            }}
          >
            Search
          </Button>


          {/* Place Holder  */}
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleCheckOut}
              sx={{
                my: 1,
                mx: 1
              }}
            >
              Check Out
            </Button>
            <LogInButtonGroup>
            </LogInButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBarHome;