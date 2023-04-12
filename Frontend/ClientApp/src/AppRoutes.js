import { Counter } from "./components/Counter";
import { Product } from "./components/Product";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/product',
    element: <Product />
  }
];

export default AppRoutes;
