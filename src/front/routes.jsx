import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Categories from "./pages/Categories";
import UserView from './pages/UserView';    // Importa el componente UserView

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
            {/* Rutas ya definidas */}
            <Route path="/" element={<Home />} />
            <Route path="/single/:theId" element={<Single />} />
            <Route path="/demo" element={<Demo />} />

            {/* Agregar rutas para /categories y /userview */}
            <Route path="/categories" element={<Categories />} />  {/* Nueva ruta para Categories */}
            <Route path="/userview" element={<UserView />} />      {/* Nueva ruta para UserView */}
        </Route>
    )
);
