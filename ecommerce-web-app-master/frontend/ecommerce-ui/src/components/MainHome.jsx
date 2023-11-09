import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TopBarHome from './TopBarHome';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import AppleImg from '../assets/phones/Apple.jpeg';
import BlackBerryImg from '../assets/phones/BlackBerry.jpeg';
import HTCImg from '../assets/phones/HTC.jpeg';
import HuaweiImg from '../assets/phones/Huawei.jpeg';
import LGImg from '../assets/phones/LG.jpeg';
import MotorolaImg from '../assets/phones/Motorola.jpeg';
import NokiaImg from '../assets/phones/Nokia.jpeg';
import SamsungImg from '../assets/phones/Samsung.jpeg';
import SonyImg from '../assets/phones/Samsung.jpeg';


const theme = createTheme({
    palette: {
        primary: {
            main: deepOrange[500],
        },
    },
});

function MainHome() {
    // alert()
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart']);
    // alert(cookies.email,cookies.shoppingCart);
    console.log(cookies.shoppingCart)

    const [phoneId, setPhoneId] = React.useState('');
    const navigate = useNavigate();
    function handleView(card) {
        setPhoneId(card._id);

        navigate({
            pathname: '/item',
            search: '?_id=' + card._id,
        });
        console.log("TODO -> HANDLE VIEW METHOD");
    }

    function useFetch(url) {

        const [data, setData] = useState([]);

        async function fetchUrl() {
            const response = await fetch(url);
            const json = await response.json();

            setData(json);
        }

        useEffect(() => {
            fetchUrl();
        }, []);

        return [data];

    }

    function ImageAdapter(props){
        const image = props['image'];

        switch (image){
            case "../assets/phones/Apple.jpeg": return <img src={AppleImg}/>
            case "../assets/phones/BlackBerry.jpeg": return <img src={BlackBerryImg}/>
            case "../assets/phones/HTC.jpeg":  return <img src={HTCImg}/>
            case "../assets/phones/Huawei.jpeg":  return <img src={HuaweiImg}/>
            case "../assets/phones/LG.jpeg":  return <img src={LGImg}/>
            case "../assets/phones/Motorola.jpeg":  return <img src={MotorolaImg}/>
            case "../assets/phones/Nokia.jpeg":  return <img src={NokiaImg}/>
            case "../assets/phones/Samsung.jpeg":  return <img src={SamsungImg}/>
            case "../assets/phones/Sony.jpeg":  return <img src={SonyImg}/>
        }

    }

    
    const [bestSeller] = useFetch(
        'http://localhost:3001/bestSellers'
    );
    const [soldOutSoon] = useFetch(
        'http://localhost:3001/soldOutSoon'
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBarHome></TopBarHome>
            <main>
                {/* Sold Out Soon Container */}
                <Container sx={{
                    py: 3,
                    mx: "auto"
                }}>
                    <Typography variant='h4'>
                        Sold Out Soon
                    </Typography>
                    <Grid
                        container
                        spacing={4}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {soldOutSoon.map((card) => (
                            <Grid item key={card._id} xs={6} sm={3} md={2}
                                justifyContent="space-between"
                                alignItems="center">
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <ImageAdapter image={card.image}></ImageAdapter>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            $ {card.price}
                                        </Typography>
                                    </CardContent>
                                    {/* Interaction Area */}
                                    <CardActions>
                                        <Button size="small" onClick={()=>handleView(card)}>View</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
                {/* Best Sellers Container */}
                <Container sx={{
                    py: 1,
                    mx: "auto"
                }}>
                    <Typography variant='h4'>
                        Best Sellers
                    </Typography>
                    <Grid
                        container
                        spacing={4}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {bestSeller.map((card) => (
                            <Grid item key={card._id} xs={6} sm={3} md={2} >
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <ImageAdapter image={card.image}></ImageAdapter>
                                    <CardContent sx={{ flexGrow: 1, mb: 0 }}>
                                        <Typography gutterBottom variant="h6" >
                                            Rating: {card.avgRating.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    {/* Interaction Area */}
                                    <CardActions sx={{ py: 0 }}>
                                        <Button size="small" onClick={()=>handleView(card)}>View</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}

export default MainHome;