import { Box, 
    Button, 
    Container, 
    Divider, 
    Grid, Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    Typography } from '@mui/material';
import * as React from 'react';
import { Cookies, useCookies } from 'react-cookie';


function createData(comment, rating, userName) {
  return { comment, rating, userName };
}

const rows = [
  createData("Sansa quoted her father when she made note of another great piece of Stark advice. No one is an island, and getting through any time of hardship requires friends, family (chosen or otherwise), or whatever one might call her pack. It's also good advice to remember your loyalties when a packmate howls for help.", 4.7, "Tony"),
  createData('Ice cream sandwich',4.7, "Tony"),
  createData('Eclair', 4.7, "Tony"),
  createData('Cupcake',4.7, "Tony"),
  createData('Gingerbread', 4.7, "Tony"),
];


function UserEditComponent() {
    const [user, setUser] = React.useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);

    const [phoneList,setList] = React.useState([])
    
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //parameters parse
          "userId": cookies.userId,
          
      })
    };
    function useFetch(url) {
    
      async function fetchUrl() {
          try{
              const response = await fetch(url, config);
              const data = await response.json();
              console.log("revies",data);
              if (data.length===0){
                  alert("Nothing is found");
                  return;
              }
              setList(data);
            
              
          } catch (e){
              console.log(e);
          }
      }
    
      React.useEffect(() => {
          fetchUrl();
      }, []);

      return {"phoneList":phoneList};

    }
    const phoneLists = useFetch('http://localhost:3001/allPhonesBySeller');
    
    console.log("list",phoneList)
    
    return (
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
{/*        
                      <Typography variant="h5" component="span">
                     Phone 1
                      </Typography>
             
           */}    
                  {phoneList.map((phone)=>
                  
                  <TableContainer component={Paper} sx={{mt:3,mb:3}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={2}>
                      {phone.title}
                      </TableCell>

                    </TableRow>
                        <TableRow>
                          <TableCell>Comment</TableCell>
                          <TableCell align="right">Rating</TableCell>
                          <TableCell align="right">User</TableCell>                     
                      </TableRow>
                      </TableHead>

                      <TableBody>
                      {phone.reviews.map((row,index) => (
                          <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                          <TableCell component="th" scope="row" sx={{width:800}}>
                              {row.comment}
                          </TableCell>
                          <TableCell align="right">{row.rating}</TableCell>
                          <TableCell align="right">{row.userInfo.at(0).firstname} {row.userInfo.at(0).lastname}</TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
                  </TableContainer>
                  
                  
                  )}

                </Paper>
              </Grid>
            </Grid>
          </Container>
        
      </Box>
    );
}

export default UserEditComponent;