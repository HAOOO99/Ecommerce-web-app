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
import { Button, FormControl, InputLabel, MenuItem, Select, Slider } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LogoutIcon from '@mui/icons-material/Logout';
import { deepOrange } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

function valuetext(value) {
  return `${value} CCC`;
}

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

function TopBarSearch(props) {

  const [price, setPrice] = React.useState(props.maxPrice);
  const [brand, setBrand] = React.useState("all");
  const [keyword, setKeyword] = React.useState(props.keyword);

  const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);
  const navigate = useNavigate();
  const handleLogInTransit = () => {
    navigate('/login');
  }

  const logout = async () => {
    await signOut(auth);
  };

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


  const handleProfile = () => {
    if (cookies.email !== undefined) {
      navigate('/user');
    } else {
      navigate('/login');
    }
  }

  function LogInButtonGroup() {
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

  function handleSearch() {
    if (keyword.length === 0) {
      alert("You need to enter a keyword first!");
      navigate('/');
      return;
    }
    props.search(keyword);
  }

  function handleFilter() {
    if (keyword.length === 0) {
      alert("You need to enter a keyword first!");
      return;
    }
    if (brand === 'all') {
      props.filter(keyword, price, "");
    } else {
      props.filter(keyword, price, brand);
    }
  }

  function handleCheckOut() {
    navigate('/checkout');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{
        //   bgcolor:"blue"    // TODO -> what color?
        bgcolor: deepOrange[500]
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
              value={keyword}
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

          {/* Drop Down Button - Brand Filter */}
          <Box sx={{ minWidth: 120 }}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="brand-filter"> Brand </InputLabel>
              <Select
                labelId="brand-filtre"
                id="brand-select"
                value={brand}
                label="Brand"
                onChange={(event) => setBrand(event.target.value)}
                color="secondary"
              >
                <MenuItem value={"all"}> All </MenuItem>
                {props.brands.map((row) => (
                  <MenuItem value={row}> {row} </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Range Slider of price */}
          <Box sx={{ width: 150 }}>

            <Slider
              getAriaLabel={() => "Price Range"}
              value={price}
              valueLabelDisplay="on"
              onChange={(event, newValue) => setPrice(newValue)}
              getAriaValueText={valuetext}
              color="secondary"
              max={props.maxPrice}
              sx={{ marginTop: 5, marginLeft: 5 }}
            ></Slider>
          </Box>
          <Button
            variant='contained'
            color='secondary'
            onClick={handleFilter}
            sx={{
              my: 1,
              ml: 10
            }}
          >
            Filter
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

            <LogInButtonGroup></LogInButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBarSearch;