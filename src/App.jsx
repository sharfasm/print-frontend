import { Suspense, lazy } from "react"
import config from "./brand/config"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { ShopProvider } from "./context/ShopContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import PageLoader from "./components/PageLoader"
import RouteTransition from "./components/RouteTransition"

// Standard Lazy Imports (React.lazy only loads the component once)
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

// Auth & Dashboard Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));
const Overview = lazy(() => import("./pages/Dashboard/Overview"));
const Orders = lazy(() => import("./pages/Dashboard/Orders"));
const DashboardWishlist = lazy(() => import("./pages/Dashboard/DashboardWishlist"));
const DashboardCart = lazy(() => import("./pages/Dashboard/DashboardCart"));
const Addresses = lazy(() => import("./pages/Dashboard/Addresses"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));
const DeliveryTracking = lazy(() => import("./pages/Dashboard/DeliveryTracking"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
};

export default function App(){

  return(
    <AuthProvider>
      <ShopProvider>
        <Navbar />
        {/* RouteTransition wrapper enforces the 0.5s premium loading delay on EVERY route change */}
        <RouteTransition>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/products" element={<Products/>}/>
              <Route path="/product/:id" element={<ProductDetails/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/wishlist" element={<Wishlist/>}/>
              <Route path="/checkout" element={<Checkout/>}/>
              <Route path="/order-confirmation" element={<OrderConfirmation/>}/>
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wishlist" element={<DashboardWishlist />} />
                <Route path="cart" element={<DashboardCart />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="delivery-tracking" element={<DeliveryTracking />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="settings" element={<Settings />} />
              </Route>

            </Routes>
          </Suspense>
        </RouteTransition>
      </ShopProvider>
    </AuthProvider>
  )
}
