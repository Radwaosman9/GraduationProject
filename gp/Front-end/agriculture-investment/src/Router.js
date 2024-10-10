import {createBrowserRouter,} from "react-router-dom";
import App from "./App";
import Body from "./components/Body";
import Category from "./components/Category";
import Info from "./components/Info";
import Login from "./pages/login/Login";
import Register from "./pages/Register/Register";
import ManageCategory from "./manage/category/ManageCategory";
import UpdateCategory from "./manage/category/UpdateCategory";
import ManageProduct from "./manage/products/ManageProduct";
import CreateProduct from "./manage/products/CreateProduct";
import UpdateProduct from "./manage/products/UpdateProduct";
import ManageInformation from "./manage/info/ManageInformation";
import UpdateInformation from "./manage/info/UpdateInformation";
import ProductList1 from "../src/pages/Product/ProductList1";
import SearchResult from "./pages/search/SearchResult";
import Fav from"./pages/favs/Fav";
import Cart from "../src/pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import UpdateProfile from "./pages/profile/UpdateProfile";
import ProductInfo from "./pages/Product/ProductInfo";
import Infos from "../src/pages/Information/Infos";
import Guest from "./middleware/Guest";
// import admin from "./middleware/admin";
import History from "../src/pages/history/History";
import ShowOrders from "../src/pages/adminHistory/Orders";
import Chat from "./pages/chat/Chat";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
        children:[
            {
                    path: "/",
                    element: <>
                    <Body/>
                    <Category/>
                    <Info/>
                    
                  </>,
                  },
                  {
                    element: <Guest />,
                    children: [
                      {
                        path:"/Login",
                        element:<Login/>
                   },
                   {
                    path:"/register",
                    element:<Register/>
                   },
                    ],
                  },
            {
                path:"/fav",
                element:<Fav/>
               },
                  {
                    path:"/UpdateInformation/:id",
                    element:<UpdateInformation/>
                   },
                   {
                    path:"/ManageInformation",
                    element:<ManageInformation/>
                   },
               {
                path:"/ManageCategory",
                element:<ManageCategory/>
               },
               {
                path:"/UpdateCategory/:id",
                element:<UpdateCategory/>
               },
               {
                path:"/ManageProduct",
                element:<ManageProduct/>
               },
               {
                path:"/CreateProduct",
                element:<CreateProduct/>
               },
               {
                path:"/updateP/:id",
                element:<UpdateProduct/>
               },
               {
                path: "/:id",
                element: <ProductList1/>,
              },
              {
                path: "/product-info/:id",
                element: <ProductInfo />,
              },
              {
                path: "/Info",
                element: <Infos/>,
              },
              {
                path:"/profile",
                element:<Profile/>
               },
               {
                path:"/updateprofile",
                element:<UpdateProfile/>
               },
               {
                path:"/cart",
                element:<Cart/>
               },
               {
                path:"/searchresult",
                element:<SearchResult/>
               },
               {
                path:"/history",
                element:<History/>
               },
       
               {
                path:"/showOrders",
                element:<ShowOrders/>
               },
               {
                path:"/chat",
                element:<Chat/>
               },
       
              
               
 ]}]);