import { Product } from "./components/Product";
import { Insert } from "./components/Insert";
import { MaterialType } from "./components/MaterialType";
import { Home } from "./components/Home";
import { Order } from "./components/Order";
import { ProductType } from "./components/ProductType";
import { Supply } from "./components/Supply";
import { Photo } from "./components/Photo";
import { StoneType } from "./components/StoneType";
import { VK } from "./components/VK";
import { Login } from "./components/Login";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },  
  {
    path: '/product',
    element: <Product />
    },
    {
        path: '/materialtype',
        element: <MaterialType />
    },
    {
        path: '/insert',
        element: <Insert />
    },
    {
        path: '/order',
        element: <Order />
    },
    {
        path: '/producttype',
        element: <ProductType />
    },
    {
        path: '/supply',
        element: <Supply />
    },
    {
        path: '/photo',
        element: <Photo />
    },
    {
        path: '/stonetype',
        element: <StoneType />
    },
    {
        path: '/vk',
        element: <VK />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/home',
        element: <Home />
    }
];

export default AppRoutes;
