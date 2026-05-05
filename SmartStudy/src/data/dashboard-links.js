import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Dashboard",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscDashboard",
    isDropdown: true,
    subItems: [
      {
        id: 51,
        name: "Enrolled Courses",
        path: "/dashboard/enrolled-courses",
        icon: "VscMortarBoard",
      },
      {
        id: 52,
        name: "Purchase History",
        path: "/dashboard/purchase-history",
        icon: "VscHistory",
      },
      {
        id: 53,
        name: "Wishlist",
        path: "/dashboard/cart",
        icon: "VscHeart",
      },
      {
        id: 54,
        name: "Explore Courses",
        path: "/explore-courses",
        icon: "VscSymbolEvent",
      },
    ],
  },
  {
    id: 6,
    name: "Master Aptitude",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscLightbulb",
    isDropdown: true,
    subItems: [
      {
        id: 61,
        name: "Verbal",
        path: "/aptitude/verbal",
        icon: "VscBook",
      },
      {
        id: 62,
        name: "Quantitative",
        path: "/aptitude/quantitative",
        icon: "VscBook",
      },
      {
        id: 63,
        name: "Logical Reasoning",
        path: "/aptitude/logical-reasoning",
        icon: "VscBook",
      },
    ],
  },
  {
    id: 7,
    name: "IIT/JEE",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscBook",
    isDropdown: true,
    subItems: [
      {
        id: 71,
        name: "JEE Main PYQ",
        path: "/aptitude/jee-main-pyq",
        icon: "VscFileText",
      },
      {
        id: 72,
        name: "Chemistry",
        path: "/aptitude/jee-chemistry",
        icon: "VscFileText",
      },
      {
        id: 73,
        name: "Maths",
        path: "/aptitude/jee-maths",
        icon: "VscFileText",
      },
    ],
  },
  {
    id: 8,
    name: "NEET",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscBook",
    isDropdown: true,
    subItems: [
      {
        id: 81,
        name: "PYQ",
        path: "/aptitude/neet-pyq",
        icon: "VscFileText",
      },
      {
        id: 82,
        name: "Biology",
        path: "/aptitude/neet-biology",
        icon: "VscFileText",
      },
    ],
  },
];
