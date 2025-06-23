import React, { useEffect,useRef, useState } from "react";
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
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { setTotalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null)

  // Responsive menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Catalog dropdown state for mobile
  const [catalogOpen, setCatalogOpen] = useState(false);

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

  // Handle Catalog dropdown for mobile
  const handleCatalogClick = (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setCatalogOpen((prev) => !prev);
    }
  };

  // Close menu on link click (mobile)
  const handleLinkClick = () => {
    setMenuOpen(false);
    setCatalogOpen(false);
  };

  const handleLoginClick = () => {
  setMenuOpen(false);
  setCatalogOpen(false);
  setTimeout(() => {
    navigate('/login');
  }, 100); // wait 100ms so state update completes
};

const handleSignupClick = () => {
  setMenuOpen(false);
  setCatalogOpen(false);
  setTimeout(() => {
    navigate('/signup');
  }, 100);
};

useEffect(() => {
  if (!menuOpen) return;

  function handleClickOutside(event) {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setMenuOpen(false);
      setCatalogOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [menuOpen]);

  return (
    <div className="flex h-16 items-center justify-center border-b border-b-richblack-700 dark:border-b-gray-700 bg-white dark:bg-gray-900 transition-colors shadow-sm">
      <div className="flex w-11/12 max-w-max-content items-center justify-between mx-auto">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl  text-white mr-2"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            width={120}
            height={32}
            loading="lazy"
            className="drop-shadow-md"
          />
        </Link>

        {/* Navlinks */}
        <nav
         ref={navRef}
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute top-16 left-0 w-full flex-col bg-white dark:bg-gray-900 md:static md:flex md:flex-row md:w-auto md:bg-transparent z-50 transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 text-base font-semibold p-4 md:p-0">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative group">
                {link.title === "Catalog" ? (
                  <div
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={handleCatalogClick}
                    onMouseLeave={() =>
                      window.innerWidth < 768 && setCatalogOpen(false)
                    }
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        matchRoute(link?.path)
                          ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text"
                          : "text-richblack-700 dark:text-white"
                      }`}
                    >
                      {link.title}
                    </span>
                    <IoIosArrowDown
                      className={`text-lg transition-transform duration-300 text-white ${
                        catalogOpen ? "rotate-180" : ""
                      }`}
                    />
                    {/* Dropdown */}
                    <div
                      className={`
                        ${
                          catalogOpen ||
                          (window.innerWidth >= 768 &&
                            "group-hover:visible group-hover:opacity-100")
                        }
                        ${
                          catalogOpen
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                        }
                        absolute left-0 top-8 min-w-[180px] rounded-md bg-white dark:bg-gray-800 shadow-lg z-20 transition-all duration-300
                      `}
                    >
                      {Array.isArray(sublinks) && sublinks.length > 0 ? (
                        sublinks.map((tag, idx) => (
                          <Link
                            key={idx}
                            to={`${tag.name}`}
                            className="block px-4 py-2 text-richblack-700 dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 rounded transition-colors"
                            onClick={handleLinkClick}
                          >
                            {tag.name}
                          </Link>
                        ))
                      ) : (
                        <span className="block px-4 py-2 text-gray-400">
                          No Categories
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} onClick={handleLinkClick}>
                    <span
                      className={`transition-colors duration-200 ${
                        matchRoute(link?.path)
                          ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text"
                          : "text-richblack-700 dark:text-white"
                      }`}
                    >
                      {link.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {/* Login/Signup for mobile */}
          <div className="flex flex-col gap-2 mt-0 md:hidden">
            {token === null && (
              <>
                <Link to="/login" onClick={handleLoginClick} >
                  <button className="w-1/4 border border-richblack-400 bg-richblack-700 text-white px-1 py-1.5 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-cyan-500 transition-all mr-4 ml-3">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={handleSignupClick} >
                  <button className="w-1/4 border border-richblack-400 bg-richblack-700 text-white px-1 py-1.5 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all mr-4 ml-3 mb-3">
                    Sign up
                  </button>
                </Link>
              </>
            )}
            {token !== null && <ProfileDropDown onAction={handleLinkClick} />}
          </div>
        </nav>

        {/* Right side: Cart, Auth, Theme Toggle */}
        <div className="hidden md:flex gap-4 items-center">
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
             <Link to="/login" >
              <button 
              className="w-full border border-richblack-400 bg-richblack-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-cyan-500 transition-all mr-4"
              // onClick={handleLoginClick}
              >
                Login
              </button>
            </Link>
            <Link to="/signup" >
              <button 
              className="w-full border border-richblack-400 bg-richblack-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition-all mr-4"
              // onClick={handleSignupClick}
              >
                Sign up
              </button>
            </Link>
            </>
          )}

          {token !== null && <ProfileDropDown  />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
