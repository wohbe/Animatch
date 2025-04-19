import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import { AniPage } from "./pages/AnimatchPage";
import AnimeCard from "./components/AnimeCard";
import { Layout } from "./pages/Layout";
export const router = createBrowserRouter(
  createRoutesFromElements(
      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

          <Route path="/" element={<Home />} />
          <Route path="/animatch" element={<AniPage />} />
          
          <Route path="/anime/:id" element={<AnimeCard />} />
      </Route>
  )
);