import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from '../../data/navbar-links';
import { useLocation ,matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from "react-icons/fa";
import { setTotalItems } from '../../slices/cartSlice';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
const Navbar = () => {
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const {cart} = useSelector((state)=> state.cart);


    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname) // checking if both match
    }
    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-max-content items-center justify-between'>

                {/* image */}
                <Link to="/">
                    <img src={Logo} alt="Logo" width={160} height={42} loading='lazy'  />
                </Link>

                {/* Navlinks */}
                <nav>
                    <ul className='flex gap-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index)=>(       
                                    <li key={index}>
                                
                                        {
                                            link.title === "Catalog"?(<div></div>): 
                                            (
                                                <Link to={link?.path}>
                                                    <p className={`${matchRoute(link?.path)?"bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400  text-transparent bg-clip-text ":"text-richblack-25"}`}>
                                                        {link.title}
                                                    </p>
                                                </Link>
                                            )
                                        }
                                    </li>                            
                            ))
                        }

                    </ul>
                </nav>

                {/*Login/Signup/Dashboard  */}
                <div className='flex gap-4 items-center'>
                    {
                        user && user?.acountType!= "Instructor" && (
                            <Link to="/dahsboard/cart" className='relative'>
                                <FaShoppingCart />
                                {
                                    setTotalItems >0 && (
                                        <span>
                                            {setTotalItems}
                                        </span>
                                    )
                                }
                            
                            </Link>
                        )

                    }

                    {
                        token === null && (
                            <Link to="/login">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Login
                                </button>
                            </Link>
                        )
                    }

                    {
                        token === null && (
                            <Link to="/signup">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign up
                                </button>
                            </Link>
                        )

                    }

                    {
                        token!== null && <ProfileDropDown/>
                    }
                </div>

            </div>
           
        </div>
    );
};

export default Navbar;