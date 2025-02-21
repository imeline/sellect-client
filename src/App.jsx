import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import OrderList from './pages/OrderList.jsx';
import OrderDetail from "./pages/OrderDetail.jsx";
import CouponRegister from "./pages/CouponRegister.jsx";
import Profile from "./pages/Profile.jsx";
import Coupons from "./components/Coupons.jsx";
import Orders from "./components/Orders.jsx";
import ProductRegister from './pages/ProductRegister.jsx';
import SellerHome from './pages/SellerHome.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Unauthorized from "./pages/Unauthorized.jsx";
import OrderForm from "./pages/OrderForm.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<RouteGuard component={Home} allowedRoles={['GUEST', 'USER']} defaultRedirect="/home" />} />
            <Route path="/home" element={<RouteGuard component={Home} allowedRoles={['GUEST', 'USER']} />} />
            <Route path="/products" element={<RouteGuard component={ProductList} allowedRoles={['GUEST', 'USER']} />} />
            <Route path="/products/:productId" element={<RouteGuard component={ProductDetail} allowedRoles={['GUEST', 'USER']} />} />
            <Route path="/user/cart" element={<RouteGuard component={Cart} allowedRoles={['USER']} />} />
            <Route path="/user/orders" element={<RouteGuard component={OrderList} allowedRoles={['USER']} />} />
            <Route path="/seller" element={<RouteGuard component={SellerHome} allowedRoles={['SELLER']} />} />
            <Route path="/coupon" element={<RouteGuard component={CouponRegister} allowedRoles={['SELLER']} />} />
            <Route path="/products/register" element={<RouteGuard component={ProductRegister} allowedRoles={['SELLER']} />} />
            <Route path="/register" element={<RouteGuard component={Register} allowedRoles={['GUEST']} />} />
            
            <Route path="/order/form" element={<RouteGuard component={OrderForm} allowedRoles={['USER']} />} />
            <Route path="/order/:id" element={<RouteGuard component={OrderDetail} allowedRoles={['USER']} />} />
            <Route path="/user/profile" element={<RouteGuard component={Profile} allowedRoles={['USER']} />}>
              <Route path="orders" element={<RouteGuard component={Orders} allowedRoles={['USER']} />} />
              <Route path="coupons" element={<RouteGuard component={Coupons} allowedRoles={['USER']} />} />
            </Route>

            <Route path="/login" element={<RouteGuard component={Login} allowedRoles={['GUEST']} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// 통합된 라우팅 가드
function RouteGuard({ component: Component, allowedRoles, defaultRedirect }) {
  const { isLoggedIn, role } = useAuth();

  // 권한 체크
  if (!allowedRoles.includes(role)) {
    if (isLoggedIn) {
      return <Navigate to={role === 'USER' ? '/home' : '/seller'} replace />;
    }
    return <Navigate to={defaultRedirect || '/home'} replace />;
  }

  return <Component />;
}

export default App;
