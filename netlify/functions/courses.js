// netlify/functions/courses.js
// Serves course data — replaces the Express /api/courses route

const courses = [
  {
    "id": 1,
    "title": "Java Full Stack",
    "category": "development",
    "icon": "☕",
    "iconImage": "/assets/course_icons/java-full-stack-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 148,
    "technologies": [
      "Core Java",
      "Spring Boot",
      "MySQL",
      "HTML",
      "CSS",
      "JavaScript",
      "REST API"
    ],
    "description": "Build enterprise-style full stack applications using Java, Spring Boot, frontend development, database design and deployment-ready project workflows.",
    "highlights": [
      "Spring Boot Apps",
      "Database Projects",
      "REST APIs",
      "Placement Training"
    ]
  },
  {
    "id": 2,
    "title": "Python Developer",
    "category": "development",
    "icon": "🐍",
    "iconImage": "/assets/course_icons/python-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 165,
    "technologies": [
      "Python",
      "OOP",
      "Django",
      "Flask",
      "REST API",
      "SQL",
      "Git"
    ],
    "description": "Learn Python from basics to backend development with real projects, database integration, APIs and clean coding practice for developer roles.",
    "highlights": [
      "Python Basics",
      "Django Projects",
      "API Development",
      "Interview Prep"
    ]
  },
  {
    "id": 3,
    "title": "Digital Marketing",
    "category": "marketing",
    "icon": "📣",
    "iconImage": "/assets/course_icons/digital-marketing.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.8,
    "students": 154,
    "technologies": [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Analytics",
      "Content",
      "Lead Generation"
    ],
    "description": "Master SEO, social media, paid ads, analytics and lead generation through campaign-based practical training for business growth roles.",
    "highlights": [
      "Live Campaigns",
      "SEO Audit",
      "Ad Strategy",
      "Analytics Reports"
    ]
  },
  {
    "id": 4,
    "title": "UI/UX Web Developer",
    "category": "design",
    "icon": "🎨",
    "iconImage": "/assets/course_icons/ui-ux-design.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.8,
    "students": 132,
    "technologies": [
      "Figma",
      "Wireframes",
      "Prototypes",
      "HTML",
      "CSS",
      "JavaScript",
      "Portfolio"
    ],
    "description": "Learn UI/UX design and web interface development with Figma, wireframes, prototypes, responsive layouts and portfolio-ready screens.",
    "highlights": [
      "Figma Projects",
      "Website UI",
      "Responsive Design",
      "Portfolio Review"
    ]
  },
  {
    "id": 5,
    "title": "MERN Full Stack",
    "category": "development",
    "icon": "⚛️",
    "iconImage": "/assets/course_icons/mern-full-stack-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 176,
    "technologies": [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "Tailwind",
      "GitHub"
    ],
    "description": "Master MongoDB, Express, React and Node by building complete production-style web apps with authentication, dashboards and APIs.",
    "highlights": [
      "MERN Projects",
      "Auth System",
      "Admin Dashboard",
      "GitHub Portfolio"
    ]
  },
  {
    "id": 6,
    "title": "Full Stack",
    "category": "development",
    "icon": "💻",
    "iconImage": "/assets/course_icons/full-stack-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 143,
    "technologies": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React.js",
      "Node.js",
      "MongoDB",
      "Express"
    ],
    "description": "Master end-to-end web development from modern frontend UIs to backend APIs, databases and real-world full stack application projects.",
    "highlights": [
      "8 Live Projects",
      "Interview Prep",
      "Resume Building",
      "GitHub Portfolio"
    ]
  }
];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  // /api/courses/:id  — path ends with a number
  const pathParts = event.path.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const id = parseInt(lastPart);

  if (!isNaN(id)) {
    const course = courses.find(c => c.id === id);
    if (!course) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Course not found' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, course }) };
  }

  // /api/courses?category=xyz
  const params = event.queryStringParameters || {};
  const { category } = params;
  const filtered = category && category !== 'all'
    ? courses.filter(c => c.category === category)
    : courses;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, courses: filtered, total: courses.length })
  };
};
