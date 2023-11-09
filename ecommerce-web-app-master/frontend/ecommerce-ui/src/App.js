import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/NewSignUpPage";
import MainHome from "./components/MainHome";
import ItemPage from "./components/ItemPage";
import ForgotPassword from "./components/ForgotPassword";
import PopUpActivate from "./components/PopUpActivate";
import CheckOut from "./components/CheckOut";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import UserPage from "./components/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHome></MainHome>}></Route>
        <Route path="/login" element={<SignInPage></SignInPage>}></Route>
        <Route path="/signup" element={<SignUpPage></SignUpPage>}></Route>
        <Route path="/item" element={<ItemPage></ItemPage>}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path="/alert" element={<PopUpActivate></PopUpActivate>}></Route>
        <Route path="/checkout" element={<CheckOut></CheckOut>}></Route>
        <Route path="/search" element={<SearchPage></SearchPage>}></Route>
        <Route path="/user" element={<UserPage></UserPage>}></Route>

      </Routes>
    </BrowserRouter>
  );
}
export default App;