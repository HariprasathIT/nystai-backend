// import { BrowserRouter as Router, Routes, Route } from "react-router";
// import SignIn from "./pages/AuthPages/SignIn";
// import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";
// import { Toaster } from 'react-hot-toast';
// import AllCourses from "./components/COURSES/AllCourses";
// import Courses1 from "./components/COURSES/Coursesdetails";



// export default function App() {
//   return (
//     <>
//       <Toaster
//         position="bottom-right"
//         toastOptions={{
//           style: {
//             zIndex: 9999,
//           },
//         }}
//       />

//       <Router>
//         <ScrollToTop />
//         <Routes>
//           {/* Dashboard Layout */}
//           <Route element={<AppLayout />}>
//             <Route index path="/" element={<Home />} />

//             {/* Others Page */}
//             <Route path="/Courses" element={<AllCourses />} />
//             <Route path="/course1" element={<Courses1 />} />
//             <Route path="/profile" element={<UserProfiles />} />
//             <Route path="/calendar" element={<Calendar />} />
//             <Route path="/blank" element={<Blank />} />

//             {/* Forms */}
//             <Route path="/form-elements" element={<FormElements />} />

//             {/* Tables */}
//             <Route path="/basic-tables" element={<BasicTables />} />

//             {/* Ui Elements */}
//             <Route path="/alerts" element={<Alerts />} />
//             <Route path="/avatars" element={<Avatars />} />
//             <Route path="/badge" element={<Badges />} />
//             <Route path="/buttons" element={<Buttons />} />
//             <Route path="/images" element={<Images />} />
//             <Route path="/videos" element={<Videos />} />

//             {/* Charts */}
//             <Route path="/line-chart" element={<LineChart />} />
//             <Route path="/bar-chart" element={<BarChart />} />
//           </Route>

//           {/* Auth Layout */}
//           <Route path="/signin" element={<SignIn />} />

//           {/* Fallback Route */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }



import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import BasicTables from "./pages/Tables/BasicTables";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Badges from "./pages/UiElements/Badges";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import AllCourses from "./components/COURSES/AllCourses";
import Courses1 from "./components/COURSES/Coursesdetails";
import ProtectedRoute from "./ProtectedRoute";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>


          {/* Shared layout (Sidebar, Header, etc.) */}
          <Route element={<AppLayout />}>


            {/* SuperAdmin Access */}
            <Route element={<RoleBasedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/Courses" element={<AllCourses />} />
              <Route path="/course1" element={<Courses1 />} />
            </Route>

            {/* Tutor Access */}
            <Route element={<RoleBasedRoute allowedRoles={["tutor"]} />}>
              <Route path="/tutorpage" element={<AllCourses />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
