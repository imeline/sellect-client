import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import ProductList from './pages/product/ProductList.jsx';
import ProductDetail from './pages/product/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import OrderList from './pages/OrderList.jsx';
import OrderDetail from "./pages/OrderDetail.jsx";
import CouponDownload from "./pages/CouponDownload.jsx";
import Profile from "./pages/Profile.jsx";
import Coupons from "./components/Coupons.jsx";
import Orders from "./components/order/Orders.jsx";
import ProductRegister from './pages/seller/ProductRegister.jsx';
import SellerHome from './pages/seller/SellerHome.jsx';
import Login from './pages/Login.jsx';
import {AuthProvider, useAuth} from './context/AuthContext.jsx';
import Unauthorized from "./pages/Unauthorized.jsx";
import OrderForm from "./pages/OrderForm.jsx";
import CouponUpload from "./pages/CouponUpload.jsx";
import PaymentHistory from "./components/PaymentHistory.jsx";
import LeaveAccount from "./components/LeaveAccount.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import OrderComplete from "./pages/OrderComplete.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import SellerProductDetail from "./pages/seller/SellerProductDetail.jsx";
import ProductEdit from "./pages/seller/ProductEdit.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* GUEST, USER 전용 */}
            <Route path="/" element={<RouteGuard component={Home} allowedRoles={['GUEST', 'USER']} defaultRedirect="/home" />} />
            <Route path="/home" element={<RouteGuard component={Home} allowedRoles={['GUEST', 'USER']} />} />
            <Route path="/products" element={<RouteGuard component={ProductList} allowedRoles={['GUEST', 'USER']} />} />
            <Route path="/products/:productId" element={<RouteGuard component={ProductDetail} allowedRoles={['GUEST', 'USER']} />} />

            {/* SELLER 전용 */}
            <Route path="/seller" element={<RouteGuard component={SellerHome} allowedRoles={['SELLER']} />} />
            <Route path="/seller/products/register" element={<RouteGuard component={ProductRegister} allowedRoles={['SELLER']} />} />
            <Route path="/seller/products/:productId/edit" element={<RouteGuard component={ProductEdit} allowedRoles={['SELLER']} />} />
            <Route path="/seller/products/:productId" element={<RouteGuard component={SellerProductDetail} allowedRoles={['SELLER']} />} />
            <Route path="/seller/dashboard" element={<RouteGuard component={SellerDashboard} allowedRoles={['SELLER']} />} />
            <Route path="/coupon/upload" element={<RouteGuard component={CouponUpload} allowedRoles={['SELLER']} />} />

            {/* USER 전용 */}
            <Route path="/cart" element={<RouteGuard component={Cart} allowedRoles={['USER']} />} />

            <Route path="/coupon" element={<RouteGuard component={CouponDownload} allowedRoles={['USER']} />} />
            <Route path="/order/form" element={<RouteGuard component={OrderForm} allowedRoles={['USER']} />} />
            <Route path="/order/:orderId" element={<RouteGuard component={OrderDetail} allowedRoles={['USER']} />} />
            <Route path="/user/profile" element={<RouteGuard component={Profile} allowedRoles={['USER']} />}>
              <Route path="orders" element={<RouteGuard component={OrderList} allowedRoles={['USER']} />} />
              <Route path="payment-history" element={<RouteGuard component={PaymentHistory} allowedRoles={['USER']} />} />
              <Route path="coupons" element={<RouteGuard component={Coupons} allowedRoles={['USER']} />} />
              <Route path="leave" element={<RouteGuard component={LeaveAccount} allowedRoles={['USER']} />} />
            </Route>
            <Route path="/payment/success" element={<RouteGuard component={PaymentSuccess} allowedRoles={['USER']} />} />
            <Route path="/order/complete" element={<RouteGuard component={OrderComplete} allowedRoles={['USER']} />} />

            {/* 인증 */}
            <Route path="/register" element={<RouteGuard component={Register} allowedRoles={['GUEST']} />} />
            <Route path="/login" element={<RouteGuard component={Login} allowedRoles={['GUEST']} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
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
      return <Navigate to={role === "USER" ? "/home" : "/seller"} replace />;
    }
    return <Navigate to={defaultRedirect || "/home"} replace />;
  }

  return <Component />;
}

export default App;
