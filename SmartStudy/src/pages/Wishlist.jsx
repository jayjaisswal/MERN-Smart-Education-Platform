import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../slices/CartSlice';

const Wishlist = () => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemoveFromWishlist = (courseId) => {
        dispatch(removeFromWishlist(courseId));
    };

    const handleAddToCart = (course) => {
        if (token) {
            dispatch(addToCart(course));
        } else {
            navigate('/login');
        }
    };

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="mx-auto max-w-maxContent px-4 py-12">
                <h1 className="mb-8 text-3xl font-bold text-richblack-5">My Wishlist</h1>
                <div className="grid h-[40vh] place-content-center rounded-lg border border-richblack-700 bg-richblack-800">
                    <p className="text-center text-richblack-300">
                        Your wishlist is empty. Start adding courses!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-maxContent px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold text-richblack-5">My Wishlist</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {wishlist.map((course) => (
                    <div
                        key={course._id}
                        className="overflow-hidden rounded-lg border border-richblack-700 bg-richblack-800 transition-all duration-200 hover:shadow-lg"
                    >
                        {/* Course Image */}
                        <div className="relative h-48 overflow-hidden bg-richblack-700">
                            <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Course Details */}
                        <div className="p-4">
                            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-richblack-5">
                                {course.courseName}
                            </h3>
                            <p className="mb-4 line-clamp-2 text-sm text-richblack-300">
                                {course.courseDescription}
                            </p>

                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-2xl font-bold text-yellow-200">
                                    ₹{course.price}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-richblack-700 px-3 py-1 text-xs font-medium text-richblack-200">
                                    {course.category?.name || 'Course'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(course)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded bg-yellow-50 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:bg-yellow-100"
                                >
                                    <FaShoppingCart size={16} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemoveFromWishlist(course._id)}
                                    className="flex items-center justify-center rounded bg-richblack-700 px-4 py-2 text-red-400 transition-all duration-200 hover:bg-richblack-600"
                                    title="Remove from wishlist"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>

                            {/* View Details Button */}
                            <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="mt-3 w-full rounded border border-richblack-600 py-2 text-richblack-200 transition-all duration-200 hover:bg-richblack-700"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
