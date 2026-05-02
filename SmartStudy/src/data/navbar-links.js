export const NavbarLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Catalog",
    // path: '/catalog',
  },
  {
    title: "Exam & Career Prep",
    path: "/aptitude",
    subItems: [
      { 
        title: "IT Interview Prep", 
        path: "/interview",
        icon: "💻",
        subItems: [
          { title: "DBMS", path: "/interview/dbms" },
          { title: "Operating System", path: "/interview/operating-system" },
          { title: "Computer Networks", path: "/interview/computer-networks" },
          { title: "SDLC", path: "/interview/sdlc" },
          { title: "OOPS", path: "/interview/oops" },
        ]
      },
      { 
        title: "ML & AI", 
        path: "/interview/machine-learning",
        icon: "🤖",
        subItems: [
          { title: "NumPy", path: "/interview/ml-numpy" },
          { title: "Pandas", path: "/interview/ml-pandas" },
          { title: "Scikit-learn", path: "/interview/ml-scikit" },
          { title: "Deep Learning", path: "/interview/ml-deep-learning" },
          { title: "NLP", path: "/interview/ml-nlp" },
        ]
      },
      { 
        title: "Programming Languages", 
        path: "/interview/programming",
        icon: "🐍",
        subItems: [
          { title: "Python", path: "/interview/python" },
          { title: "Java", path: "/interview/java" },
          { title: "C++", path: "/interview/cpp" },
          { title: "JavaScript", path: "/interview/javascript" },
        ]
      },
      { 
        title: "IT Company Wise", 
        path: "/interview/it-companywise",
        icon: "🏢",
        subItems: [
          { title: "TCS", path: "/interview/tcs" },
          { title: "Infosys", path: "/interview/infosys" },
          { title: "Wipro", path: "/interview/wipro" },
          { title: "Accenture", path: "/interview/accenture" },
          { title: "Capgemini", path: "/interview/capgemini" },
        ]
      },
      { 
        title: "IIT JEE PYQ", 
        path: "/interview/iit-jee",
        icon: "📚",
        subItems: [
          { title: "Physics", path: "/interview/iit-jee-physics" },
          { title: "Chemistry", path: "/interview/iit-jee-chemistry" },
          { title: "Mathematics", path: "/interview/iit-jee-mathematics" },
        ]
      },
      { 
        title: "NEET PYQ", 
        path: "/interview/neet",
        icon: "����",
        subItems: [
          { title: "Physics", path: "/interview/neet-physics" },
          { title: "Chemistry", path: "/interview/neet-chemistry" },
          { title: "Biology", path: "/interview/neet-biology" },
        ]
      },
    ],
  },
  {
    title: "About Us",
    path: "/about",
  },
  {
    title: "Contact Us",
    path: "/contact",
  },
];
