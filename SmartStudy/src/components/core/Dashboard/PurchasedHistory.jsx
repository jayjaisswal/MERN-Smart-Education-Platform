import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const PurchasedHistory = () => {
    const { token } = useSelector((state) => state.auth);
    const [purchasedCourses, setPurchasedCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedHistory = async () => {
            try {
                setLoading(true);
                const courses = await getUserEnrolledCourses(token);
                setPurchasedCourses(courses || []);
            } catch (error) {
                console.log('Error fetching purchased history:', error);
                setPurchasedCourses([]);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPurchasedHistory();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8">
            <div className="text-3xl text-richblack-50 mb-8">Purchase History</div>

            {!purchasedCourses || purchasedCourses.length === 0 ? (
                <div className="grid h-[40vh] place-content-center rounded-lg bg-richblack-800 border border-richblack-700">
                    <p className="text-richblack-300 text-center">
                        You haven't purchased any courses yet.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-richblack-800 rounded-lg border border-richblack-700">
                    <table className="w-full text-left text-richblack-100">
                        <thead className="bg-richblack-700 border-b border-richblack-600">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Course Name</th>
                                <th className="px-6 py-3 font-semibold">Instructor</th>
                                <th className="px-6 py-3 font-semibold">Price</th>
                                <th className="px-6 py-3 font-semibold">Date of Purchase</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchasedCourses.map((course, index) => (
                                <tr
                                    key={course._id || index}
                                    className="border-b border-richblack-600 hover:bg-richblack-700 transition-all duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-richblack-5">
                                                    {course.courseName}
                                                </p>
                                                <p className="text-xs text-richblack-400">
                                                    {course.courseDescription?.length > 40
                                                        ? `${course.courseDescription.slice(0, 40)}...`
                                                        : course.courseDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-richblack-200">
                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-yellow-200 font-semibold">
                                            ₹{course.price}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-richblack-200">
                                        {formatDate(course.enrollmentDate)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-200">
                                            Purchased
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PurchasedHistory;