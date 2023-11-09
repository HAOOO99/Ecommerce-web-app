import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import TopBarHome from './TopBarHome';
import Typography from '@mui/material/Typography';
import { Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import { borderRight, Box } from '@mui/system';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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

let count =1;
function ItemPage() {

    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);
    const [searchParams, setSearchParams] = useSearchParams();
    let v;

    const [stock,setStock] = useState(0);
    
    // console.log(cookies.shoppingCart==="" || undefined);
    if(cookies.shoppingCart==="" ||cookies.shoppingCart=== undefined){
        v = 0;
    }
    else{
        // console.log(cookies.shoppingCart.find(element=>element.id===searchParams.get("_id")))
        if(cookies.shoppingCart.find(element=>element.id===searchParams.get("_id")) === undefined){
            v=0;
        }
        else{
            v = cookies.shoppingCart.find(element=>element.id===searchParams.get("_id")).count

        }

    }    

    
    const [reviews,setReviews] = useState([]);
    const [title,setTitle]=useState("");
    const [brand,setBrand] = useState("");
    const [seller,setSeller] = useState("");
    
    const [price, setPrice] = useState(0);
    const [currentAdd, setCurrentAdd] = useState(v);
    const [dataRows, setData] = useState([]);
    const [firstname,setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "phoneId": searchParams.get("_id"),
            
        })
      };
    function useFetch(url) {
        // const [info,setInfo] = useState({})
       
        async function fetchUrl() {
            try{
                const response = await fetch(url, config);
                const data = await response.json();
                console.log("revies",data.at(0));
                if (data.length===0){
                    alert("Nothing is found");
                    return;
                }
                setReviews(data.at(0).reviews);
                setTitle(data.at(0).title);
                setBrand(data.at(0).brand);
                setPrice(data.at(0).price);
                setStock(data.at(0).stock-v);      
                setSeller(data.at(0).seller);
                setFirstname(data.at(0).sellerInfo.at(0).firstname);
                setLastname(data.at(0).sellerInfo.at(0).lastname);
                if(data.at(0).reviews.length>3){
                    setData(data.at(0).reviews.slice(0,3)) 
                }   
                else{
                    if(data.at(0).reviewer!=null){
                        setData(data.at(0).reviews)             
                    }
                    else{
                        setData(data.at(0).reviews)
                        console.log(dataRows)
                    }
                     
                }
                
            } catch (e){
                console.log(e);
            }
        }
       
        useEffect(() => {
            fetchUrl();
        }, []);

        return {reviewsList:reviews,
                title:title,
                brand:brand,
                price:price,
                stock:stock,
                seller:seller,
                };

    }
    const info = useFetch('http://localhost:3001/phoneInfo');



    // reviews list show 
    const handleShowMoreTable = (event) => {
        count+=1;
        event.preventDefault();
        
        console.log(count);
        setData(info["reviewsList"].slice(0,3*count));
        
    };
   
    function Slicer(props){
        const[showMore, setShowMore]= useState(false);
        if(props.content !== undefined){
            if (props.content.length >= 200 && (!showMore)){
                return <TableCell>
                    {props.content.slice(0,200)}
                    <br />
                    <Link variant="text" size="small" px={2} sx={{pl:0}} onClick={()=>setShowMore(true)}>show more...</Link>
                </TableCell>
            } else {
                return <TableCell>
                    {props.content}
                </TableCell>
            }
        }

       
    }
    //rating value
    const [value, setValue] = React.useState(0);
    const [comment, setComment] = useState("");
    const [flag, setFlag] = useState(false);
    
    const handleSubmitComment = ()=>{
        console.log(value,comment);
        if(value === 0 || comment === "" ){
            alert("You need to input valid comment or rating!");

        }
        else if(cookies.email === undefined){
            alert("You need to log in first");
        }
        else{
            const body = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    //need parse parameter
                    "phoneId": searchParams.get("_id"),
                    "comment": {
                        //need parameter
                        "reviewer": cookies.userId,
                        "rating": value,
                        "comment": comment,
                        
                    }
                    
                })
            };
            
            async function fetchUrl() {
                const response = await fetch("http://localhost:3001/newComment", body);
                const json = await response.json();
    
                console.log(json)
            }
            fetchUrl();
            const obj = {"reviewer": cookies.userId,
            "rating": value,
            "comment": comment,
            "userInfo":[
                {
                    "email": cookies.email,
                    "firstname": cookies.userFirstName,
                    "lastname": cookies.userLastName
                }
            ]}
            // setReviews(info["reviewsList"].push(obj))
            info["reviewsList"].push(obj)
            // console.log(info["reviewsList"])
    
            setValue(0);
            setComment("");
        }
    }
    
    useEffect(() => {
        if(flag===true){
            handleSubmitComment();
            
            setFlag(false);
        }
    }, []);

    //add to cart dialog
    const [open, setOpen] = React.useState(false);
    const [qty, setQty] = useState(0);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        console.log(cookies.email);
        if(cookies.email===undefined){
            navigate('/login');
        }
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    function union(arr) {
        arr = arr || []
        var tmp = {}
        for (var i = 0, len = arr.length; i < len; i++) {
          var obj = arr[i]
          if (obj.id in tmp) {
            tmp[obj.id].count += parseInt(obj.count)
            tmp[obj.id].price += parseFloat(obj.price);
          } else {
            tmp[obj.id] = obj
          }
        }
        var result = []
        for (var key in tmp) {
          result.push(tmp[key])
        }
        return result
      }
    
    const handleSelectNumber =() =>{
        // console.log(qty);
        if (qty>info["stock"] ){
            alert("You can not select the quantity larger than available stocks!")
        }
        else if(qty <=0){
            alert("You must select a positive number as quantity");
        }
        else{

            console.log(cookies.shoppingCart==="")
            console.log("cookies",cookies);
            let carts = [];
            if(cookies.shoppingCart===""){
                let tmp = cookies.shoppingCart.split();
                console.log(cookies.shoppingCart.split())
                tmp.push({"id":searchParams.get("_id"),"count":parseInt(qty),"phoneName":title,
                "price":parseFloat(price), "stock":parseInt(info["stock"])});
                let cart = tmp.slice(1)
                carts = cart;
            }
            
            else{
                    console.log(cookies.shoppingCart)

                    cookies.shoppingCart.push({"id":searchParams.get("_id"),
                                                "count":parseInt(qty),
                                                "phoneName":title,
                                                "price":parseFloat(price),
                                                "stock":parseInt(info["stock"])});
                    carts= union(cookies.shoppingCart)
            }
            
            cookies.shoppingCart = carts
            console.log("carts",carts)

            setCookie('shoppingCart', 
                JSON.stringify(carts),
                {'path': '/'}
            );
            // removeCookie("shoppingCart");
            
            v = carts.find(element=>element.id===searchParams.get("_id"));
            setStock(info["stock"]-qty);

            // console.log(e.count)
            setCurrentAdd(v.count);
            // console.log(currentAdd)
            setOpen(false);
            
        }
        
    }

    function ImageAdapter(props){
        const brand = props['brand'];

        switch (brand){
            case "Apple": return <img alt="Apple" src={AppleImg} width="350"/>
            case "BlackBerry": return <img alt="BlackBerry" src={BlackBerryImg} width="350"/>
            case "HTC":  return <img alt="HTC" src={HTCImg} width="350"/>
            case "Huawei":  return <img alt="Huawei" src={HuaweiImg} width="350"/>
            case "LG":  return <img alt="LG" src={LGImg} width="350"/>
            case "Motorola":  return <img alt="Motorola" src={MotorolaImg} width="350"/>
            case "Nokia":  return <img alt="Nokia" src={NokiaImg} width="350"/>
            case "Samsung":  return <img alt="Samsung" src={SamsungImg} width="350"/>
            case "Sony":  return <img alt="Sony" src={SonyImg} width="350"/>
            default: return <img alt="apple" src={AppleImg} width="350"/>
        }

    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBarHome></TopBarHome>
            <main>
            <Container sx={{
                    py: 5,
                    mx: "auto"
                }}>
                <Grid
                    container
                    spacing={10}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item xs={4}>
                            {/* <CardMedia
                                component="img"
                                image="../assets/phones/Samsung.jpeg"
                                height={200}
                                alt="Samsung"
                            /> */}
                            {/* <img src={SamsungImg}></img> */}
                            <ImageAdapter brand={info['brand']}></ImageAdapter>
                    </Grid> 
                    <Grid item xs={8}>
                            <Typography variant="h5" sx={{my:3}} component="div">
                                {info["brand"]} ----- {info["title"]}
                                <Typography variant="caption" sx={{my:3}} component="p">
                                {/* seller's full name (concatenation of first name and last name). */}
                                {/* {sellerinfo["firstname"]+sellerinfo["lastname"]} */}
                                Seller: {firstname} {lastname}
                                </Typography>
                            </Typography>
                            <Typography variant="h5" sx={{my:3}} component="div">
                                $ {info["price"]}
                            </Typography>
                            <Grid
                                container
                                spacing={5}
                                mt={-10}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid item xs={6}>
                                        <Typography variant="body1" sx={{my:3}} component="div" >
                                        current Added:  
                                        <TextField
                                                    variant='outlined'
                                                    value={currentAdd}
                                                    size="small"
                                                    sx={{ mx: 3}}
                                                    // onchange={()=>setCurrentAdd(qty)}
                                                    inputProps={
                                                        { readOnly: true, }
                                                    }
                                                    style ={{width: '12%'}}></TextField>
                                                    
                                        </Typography>
                                    </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" sx={{my:3}} component="div" >
                                    Available Stocks : {info["stock"]} 
                                                
                                    </Typography>
                                    <Button variant="outlined" sx={{ mx: 3}} onClick={handleClickOpen}>
                                        Add to cart
                                    </Button>
                                    <Dialog open={open} onClose={handleClose}>
                                        <DialogTitle>Quantity Select</DialogTitle>
                                        <DialogContent>
                                        <DialogContentText>
                                           You need to choose a quantity.
                                        </DialogContentText>
                                        <TextField
                                            id="outlined-number"
                                            label="Number"
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={(event)=>setQty(event.target.value)}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={()=>handleSelectNumber()}>Choose</Button>
                                        </DialogActions>
                                     </Dialog>
                                </Grid>

                            </Grid>
                            
                    </Grid>
                </Grid>
            </Container>
            <Divider variant="middle" />
            <Container sx={{
                    py: 5,
                    mx: "auto"
                }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Comment</TableCell>
                                <TableCell >Rating</TableCell>
                                <TableCell >User </TableCell>                     
                            </TableRow>
                            </TableHead>
                        
                            <TableBody id="table">
                            {dataRows.map((tmp, index)=>
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <Slicer content={tmp.comment}></Slicer>
                            
                                <TableCell >{tmp.rating}</TableCell>
                                {(tmp.userInfo !== undefined && tmp.userInfo.length > 0)&&
                                    <TableCell component="th" scope="row" >
                                    {tmp.userInfo.at(0).firstname} {tmp.userInfo.at(0).lastname}
                                    </TableCell>
                                    
                                }
                                
                                </TableRow>
                            )}          
                            </TableBody>                                      
                    </Table>
                </TableContainer>
                {dataRows.length < info["reviewsList"].length &&
                
                <Box py={2}>
                <Link variant="text" size="small" onClick={handleShowMoreTable}
                 onChange={()=>setFlag(true)} sx={{pl:110}}>show more...</Link>

                </Box>}
                
            </Container>
            <Divider variant="middle" />
            <Container sx={{
                    py: 5,
                    mx: "auto"
                }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    spacing={{ xs:2, sm:3, md:5 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                   
                    alignItems="center"
                >
                    <Grid item xs={2}>
                        <TextareaAutosize
                           aria-label="minimum height"
                           minRows={5}
                           placeholder="Comment here ...."
                           style={{ width: 400 }}
                           onChange={(event)=>setComment(event.target.value)}
                            />
                        
                    </Grid>
                    <Grid item xs={2} sx={{pl:-10}}>

                    <Rating
                        name="simple-controlled"
                        value={value}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        />
                        
                    </Grid>
                    <Grid item xs={2} sx={{pl:-10}}>
                        
                        <Button variant="outlined" onClick={()=>handleSubmitComment()}>Submit</Button>
                        
                    </Grid>
                </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}






export default ItemPage;