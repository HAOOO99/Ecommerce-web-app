import * as React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import TopBarSearch from "./TopBarSearch";
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';



const theme = createTheme({
    palette: {
        primary: {
            main: deepOrange[500],
        },
    },
});

function createData(name, brand, quantity, price, link) {
    return { name, brand, quantity, price, link};
}

function SearchPage() {

    const [results, setResults] = React.useState([]);
    const [brands, setBrands] = React.useState(["All"]);
    const [max, setMax] = React.useState(9999);
    const [searchParams] = useSearchParams();

    async function searchByKeyword(keyword) {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": keyword,
                "brand": "",
                "price": Number.MAX_SAFE_INTEGER,
            })
        };
        try{
            const response = await fetch("http://localhost:3001/targetPhones", config);
            const data = await response.json();
            console.log(data);
            if (data.length===0){
                alert("Nothing is found");
                return;
            }
            setResults(data)
            let brandArray = [];
            let maxPrice = 0;
            for (var i = 0; i < data.length; i++){
                if (data[i].price > maxPrice){
                    maxPrice = data[i].price;
                }
                if (!brandArray.includes(data[i].brand)){
                    brandArray.push(data[i].brand);
                }
            }
            setBrands(brandArray);
            setMax(maxPrice);
        } catch (e){
            console.log(e);
        }
    }

    async function filter(keyword, maxPrice, brand) {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": keyword,
                "brand": brand,
                "price": maxPrice,
            })
        };
        try{
            const response = await fetch("http://localhost:3001/targetPhones", config);
            const data = await response.json();
            console.log(data);
            if (data.length===0){
                alert("Nothing is found");
                return;
            }
            setResults(data)
        } catch (e){
            console.log(e);
        }
    }
    

    useEffect(() => {
        let keyword = searchParams.get('keyword');
        searchByKeyword(keyword); // TODO
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBarSearch keyword={searchParams.get('keyword')} maxPrice={max} brands={brands} search={searchByKeyword} filter={filter}></TopBarSearch>
            <main>
                <Typography variant="h5" component="div" sx={{ py: 3, px: 3 }}>
                    Search Results
                </Typography>

                <Container sx={{
                    py: 5,
                    mx: "auto"
                }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell aligh="left">Name</TableCell>
                                    <TableCell align="left">Brand</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody id="table">
                                {results.map((row) => (
                                    <TableRow
                                        key={ row._id }
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <a href={"http://localhost:3000/item?_id=" + row._id}> 
                                            {row.title}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {row.brand}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.stock}
                                        </TableCell>
                                        <TableCell align="right">${row.price}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>


                        </Table>
                    </TableContainer>

                </Container>

            </main>
        </ThemeProvider>
    );
}

export default SearchPage;