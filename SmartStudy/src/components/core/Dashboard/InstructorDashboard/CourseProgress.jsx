// import { Link } from "react-router-dom";

// export default function CourseProgress({ courses }) {
//   return (
//     <div className="min-w-[300px] rounded-md bg-richblack-800 p-6">
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-bold text-richblack-5">Course Progress</p>
//         <Link to="/dashboard/my-courses">
//           <p className="text-xs font-semibold text-yellow-50">View All</p>
//         </Link>
//       </div>

//       <div className="mt-4 space-y-4">
//         {courses.slice(0, 5).map((course) => {
//           const percent =
//             course.completedLessons && course.totalLessons
//               ? Math.round(
//                   (course.completedLessons / course.totalLessons) * 100
//                 )
//               : 0;

//           return (
//             <div key={course._id}>
//               <p className="text-sm text-richblack-200">{course.courseName}</p>
//               <div className="w-full bg-richblack-700 h-2 rounded-md mt-1">
//                 <div
//                   className="h-2 rounded-md bg-yellow-400"
//                   style={{ width: `${percent}%` }}
//                 />
//               </div>
//               <p className="text-xs text-richblack-300 mt-1">
//                 {percent}/100
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
