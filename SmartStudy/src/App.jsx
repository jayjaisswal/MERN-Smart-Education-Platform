import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { Route, Routes, useNavigate, Outlet } from "react-router-dom";
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
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import ExploreCourses from "./pages/ExploreCourses";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import ScrollToTop from "./components/ScrollToTop";
import InstructorChart from "./components/core/Dashboard/InstructorDashboard/InstructorChart";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import AptitudePractice from "./components/Aptitude/AptitudePractice";
import AptitudeTopics from "./components/Aptitude/AptitudeTopics";
import AptitudeQuestions from "./components/Aptitude/AptitudeQuestions";
import DbmsInterviewTheory from "./components/Interview/DBMS/DbmsInterviewTheory";
import ComputerNetworkingTheory from "./components/Interview/ComputerNetworking/ComputerNetworkingTheory";
import InterviewHome from "./components/Interview/InterviewHome";
import InterviewTopics from "./components/Interview/InterviewTopics";
import InterviewQuestions from "./components/Interview/InterviewQuestions";
import InterviewPage from "./pages/InterviewPage";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  // console.log("User in App.jsx:", user);
  return (
    <div className="w-screen min-h-screen overflow-hidden bg-richblack-900 flex flex-col">
      <div>
        <Navbar />
        <div className="mt-16">
          {" "}
          {/* This adds spacing below fixed navbar */}
          <Outlet />
        </div>
      </div>
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/explore-courses" element={<ExploreCourses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

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

{/* interview */}
        <Route path="/interview" element={<InterviewHome />} />
        <Route path="/interview/:category" element={<InterviewTopics />} />
        <Route path="/interview/:category/:topic" element={<InterviewQuestions />} />
        <Route path="/interview/:category/:topic/:type" element={<InterviewPage />} />
        <Route path="/dbms" element={<DbmsInterviewTheory />} />
        <Route path="/computer-networks" element={<ComputerNetworkingTheory />} />

        {/* New dropdown categories - use InterviewPage for ML, AI, Programming, Company Wise, IIT JEE, NEET */}
        <Route path="/interview/machine-learning" element={<InterviewPage />} />
        <Route path="/interview/machine-learning/:topic" element={<InterviewPage />} />
        <Route path="/interview/machine-learning/:topic/:type" element={<InterviewPage />} />
        <Route path="/interview/python" element={<InterviewPage />} />
        <Route path="/interview/python/:topic" element={<InterviewPage />} />
        <Route path="/interview/python/:topic/:type" element={<InterviewPage />} />
        <Route path="/interview/it-companywise" element={<InterviewPage />} />
        <Route path="/interview/it-companywise/:topic" element={<InterviewPage />} />
        <Route path="/interview/it-companywise/:topic/:type" element={<InterviewPage />} />
        <Route path="/interview/iit-jee" element={<InterviewPage />} />
        <Route path="/interview/iit-jee/:topic" element={<InterviewPage />} />
        <Route path="/interview/iit-jee/:topic/:type" element={<InterviewPage />} />
        <Route path="/interview/neet" element={<InterviewPage />} />
        <Route path="/interview/neet/:topic" element={<InterviewPage />} />
        <Route path="/interview/neet/:topic/:type" element={<InterviewPage />} />


        {/* Aptitude Practice */}
        <Route path="/aptitude" element={<AptitudePractice />} />
        <Route path="/aptitude-topics/:category" element={<AptitudeTopics />} />
        <Route path="/aptitude-questions/:category/:topic" element={<AptitudeQuestions />} />

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
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="add-course" element={<AddCourse />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="edit-course/:courseId" element={<EditCourse />} />
              <Route path="instructor" element={<Instructor />} />
            </>
          )}
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
