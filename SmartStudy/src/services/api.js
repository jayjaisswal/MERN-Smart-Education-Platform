// const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const categories = {
    CATEGORIES_API: BASE_URL + "/api/v1/course/showAllCategories"
    //http://localhost:4000/api/v1/course/showAllCategories
};