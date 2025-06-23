import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "../src/components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Settings from "./components/core/Dashboard/Settings";
import PurchasedHistory from "./components/core/Dashboard/PurchasedHistory";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
function App() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  // console.log("User in App.jsx:", user);
  return (
    <div className="w-screen min-h-screen bg-white dark:bg-richblack-900 flex flex-col">
      <Navbar></Navbar>

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* signup */}
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        {/* login */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        {/*forgot-password */}
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgetPassword />
            </OpenRoute>
          }
        />

        {/* verify-email */}
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* update-password/:id */}
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

       

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="cart" element={<Cart />} />
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                <Route path="purchase-history" element={<PurchasedHistory />} />
                <Route path="community" element={<div className="text-white">Community Coming Soon...</div>} />
                
              </>
            )}
     </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
