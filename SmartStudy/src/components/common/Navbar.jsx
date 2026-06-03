import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { InterviewLinks } from "../../data/interviewLink";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import SearchBox from "./SearchBox";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import Spinner from "../../spinner/Spinner";

const Navbar = () => {
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [sublinks, setSubLinks] = useState([]);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubLinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.allTags);
      } catch (error) {
        console.error("Category fetch failed:", error);
      }
    };
    fetchSubLinks();
  }, []);

  useEffect(() => {
    handleLinkClick();
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
        setCatalogOpen(false);
        setInterviewOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const matchRoute = (route) => route && matchPath({ path: route }, location.pathname);

  const handleDropdownToggle = (title, e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      if (title === "Catalog") {
        setCatalogOpen((prev) => !prev);
        setInterviewOpen(false);
      } else if (title === "Exam & Career Prep") {
        setInterviewOpen((prev) => !prev);
        setCatalogOpen(false);
      }
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setCatalogOpen(false);
    setInterviewOpen(false);
  };

  if (profileLoading || authLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-center z-50">
        {/* <Spinner /> */}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-16 border-b border-gray-700 bg-gray-900 shadow-sm transition-colors" ref={navRef}>
      <div className="flex w-11/12 max-w-max-content h-full items-center justify-between mx-auto gap-4">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center flex-shrink-0" onClick={handleLinkClick}>
          <img
            src={Logo}
            alt="Logo"
            width={130}
            height={35}
            loading="lazy"
            className="drop-shadow-md md:w-[150px]"
          />
        </Link>

        {/* Center: Search Box - Desktop Only */}
        <div className="hidden md:block flex-1 max-w-sm mx-4">
          <SearchBox />
        </div>

        {/* Right Actions for MOBILE (Matches exactly what you liked) */}
        <div className="flex items-center gap-3 md:hidden">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative text-white p-1.5 hover:text-sky-500 transition-colors" onClick={handleLinkClick}>
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token && (
            <div className="flex items-center justify-center">
              <ProfileDropDown />
            </div>
          )}

          <button
            className="text-xl text-white p-2 focus:outline-none transition-transform"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Wrapper - Forces alignment layouts dynamically */}
        <nav
          className={`
            fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-gray-900 border-t border-gray-800 flex flex-col justify-between overflow-y-auto p-6 transition-all duration-300 ease-in-out z-40
            ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:opacity-100"}
            md:static md:h-auto md:w-auto md:border-none md:p-0 md:flex md:flex-row md:translate-x-0 md:overflow-visible md:bg-transparent md:flex-1 md:justify-end md:gap-8
          `}
        >
          {/* Main Navigation Links */}
          <ul className="flex flex-col md:flex-row gap-5 md:gap-6 text-base w-full md:w-auto items-start md:items-center">
            {NavbarLinks.map((link, index) => {
              const isCatalog = link.title === "Catalog";
              const isInterview = link.title === "Exam & Career Prep";
              const isDropdown = isCatalog || isInterview;
              const isOpen = isCatalog ? catalogOpen : interviewOpen;

              return (
                <li key={index} className="relative group w-full md:w-auto">
                  {isDropdown ? (
                    <div className="w-full md:w-auto">
                      <div
                        className="flex items-center justify-between md:justify-start gap-1 cursor-pointer select-none py-2 md:py-0"
                        onClick={(e) => handleDropdownToggle(link.title, e)}
                      >
                        <span
                          className={`transition-colors duration-200 ${matchRoute(link?.path)
                            ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text font-medium"
                            : "text-white hover:text-sky-400"
                            }`}
                        >
                          {link.title}
                        </span>
                        <IoIosArrowDown
                          className={`text-base transition-transform duration-300 text-white group-hover:text-sky-400 ${isOpen ? "rotate-180" : ""
                            } md:group-hover:rotate-180`}
                        />
                      </div>

                      {/* Dropdown Items Menu */}
                      <div
                        className={`
                          w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:top-full md:mt-2 md:min-w-[220px] rounded-xl bg-gray-800 md:bg-gray-900/95 md:backdrop-blur-md shadow-2xl z-50 border border-gray-700 transition-all duration-200
                          ${isOpen ? "block mt-2 opacity-100 visible" : "hidden opacity-0 invisible"}
                          md:group-hover:block md:group-hover:opacity-100 md:group-hover:visible
                        `}
                      >
                        {isCatalog && (
                          <div className="p-1.5 space-y-1">
                            {Array.isArray(sublinks) && sublinks.length > 0 ? (
                              sublinks.map((tag, idx) => (
                                <Link
                                  key={idx}
                                  to={`/catalog/${tag.name.split(" ").join("-").toLowerCase()}`}
                                  className="block px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                  onClick={handleLinkClick}
                                >
                                  {tag.name}
                                </Link>
                              ))
                            ) : (
                              <span className="block px-4 py-2 text-sm text-gray-400">No Categories</span>
                            )}
                          </div>
                        )}

                        {isInterview && (
                          <div className="p-1.5 space-y-1">
                            {Array.isArray(InterviewLinks) && InterviewLinks.length > 0 ? (
                              InterviewLinks.map((item, idx) => (
                                <Link
                                  key={idx}
                                  to={item.path}
                                  className="block px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                  onClick={handleLinkClick}
                                >
                                  {item.title}
                                </Link>
                              ))
                            ) : (
                              <span className="block px-4 py-2 text-sm text-gray-400">No Subjects</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path} className="block py-2 md:py-0" onClick={handleLinkClick}>
                      <span
                        className={`transition-colors duration-200 ${matchRoute(link?.path)
                          ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-transparent bg-clip-text font-medium"
                          : "text-white hover:text-sky-400"
                          }`}
                      >
                        {link.title}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop Auth Actions Container (Pushed entirely to the Right Edge) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Desktop Cart */}
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative text-white p-1.5 hover:text-sky-500 transition-colors" onClick={handleLinkClick}>
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Desktop Login / Signup */}
            {!token && (
              <div className="flex gap-3 items-center">
                <Link to="/login">
                  <button className="border border-richblack-400 bg-richblack-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-all hover:bg-richblack-800">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-richblack-400 bg-richblack-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-all hover:bg-richblack-800">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {/* Desktop Profile Dropdown */}
            {token && (
              <div className="flex items-center justify-center z-50">
                <ProfileDropDown />
              </div>
            )}
          </div>

          {/* Drawer Footer Container (Mobile Only) */}
          <div className="mt-auto pt-6 border-t border-gray-800 flex flex-col gap-4 md:hidden w-full">
            <div className="w-full">
              <SearchBox />
            </div>

            {!token && (
              <div className="grid grid-cols-2 gap-3 w-full">
                <Link to="/login" className="w-full" onClick={handleLinkClick}>
                  <button className="w-full text-center border border-richblack-400 bg-richblack-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-richblack-800">
                    Login
                  </button>
                </Link>
                <Link to="/signup" className="w-full" onClick={handleLinkClick}>
                  <button className="w-full text-center border border-richblack-400 bg-richblack-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-richblack-800">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </nav>

      </div>
    </div>
  );
};

export default Navbar;