import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { setTotalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  // Responsive menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // api call
  const [sublinks, setSubLinks] = useState([]);
  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allTags);
    } catch (error) {
      // handle error
    }
  };
  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    if (!route) return false;
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-16 items-center justify-center border-b border-b-richblack-700 dark:border-b-gray-700 bg-white dark:bg-gray-900 transition-colors shadow-sm">
      <div className="flex w-11/12 max-w-max-content items-center justify-between mx-auto">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-richblack-900 dark:text-white mr-2"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" width={120} height={32} loading="lazy" className="drop-shadow-md" />
        </Link>

        {/* Navlinks */}
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute top-16 left-0 w-full flex-col bg-white dark:bg-gray-900 md:static md:flex md:flex-row md:w-auto md:bg-transparent z-50 transition-all duration-300`}
        >
         <ul className="flex flex-col md:flex-row gap-4 md:gap-6 text-base font-semibold p-4 md:p-0">
  {NavbarLinks.map((link, index) => (
    <li key={index} className="relative group">
      {link.title === "Catalog" ? (
        <div className="flex items-center gap-1 cursor-pointer select-none">
          <span
            className={`transition-colors duration-200 ${
              matchRoute(link?.path)
                ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text"
                : "text-richblack-700 dark:text-white"
            } hover:text-sky-500`}
          >
            {link.title}
          </span>
          <IoIosArrowDown className="text-lg group-hover:rotate-180 transition-transform duration-300" />
          {/* Dropdown */}
          <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute left-0 top-8 min-w-[180px] rounded-md bg-white dark:bg-gray-800 shadow-lg z-20 transition-all duration-300">
            {Array.isArray(sublinks) && sublinks.length > 0 ? (
              sublinks.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`${tag.name}`}
                  className="block px-4 py-2 text-richblack-700 dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {tag.name}
                </Link>
              ))
            ) : (
              <span className="block px-4 py-2 text-gray-400">No Categories</span>
            )}
          </div>
        </div>
      ) : (
        <Link to={link?.path}>
          <span
            className={`transition-colors duration-200 ${
              matchRoute(link?.path)
                ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text"
                : "text-richblack-700 dark:text-white"
            } hover:text-sky-500`}
          >
            {link.title === "Home" && <span className="mr-1">🏠</span>}
            {link.title === "About Us" && <span className="mr-1">ℹ️</span>}
            {link.title === "Contact Us" && <span className="mr-1">📞</span>}
            {link.title}
          </span>
        </Link>
      )}
    </li>
  ))}
</ul>
          {/* Login/Signup for mobile */}
          <div className="flex flex-col gap-2 mt-4 md:hidden">
            {token === null && (
              <>
                <Link to="/login">
                  <button className="w-full border border-blue-400 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-cyan-500 transition-all mr-4">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full border border-green-400 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all mr-4">
                    Sign up
                  </button>
                </Link>
              </>
            )}
            {token !== null && <ProfileDropDown />}
          </div>
        </nav>

        {/* Right side: Cart, Auth, Theme Toggle */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-2xl text-richblack-900 dark:text-white hover:text-sky-500 dark:hover:text-yellow-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Cart */}
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative text-white">
              <FaShoppingCart className="text-xl hover:text-sky-500 transition-colors" />
              {setTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                  {setTotalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth Buttons */}
          {token === null && (
            <>
              <Link to="/login">
                <button className="border border-blue-400 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-cyan-500 transition-all">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="ml-2 border border-green-400 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all">
                  Sign up
                </button>
              </Link>
            </>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;