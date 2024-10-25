// Store notes in localStorage
let notes = JSON.parse(localStorage.getItem('examNotes')) || [];

// Define subcategories for each category
const subcategories = {
    "GK": ["", "Data", "figure", "example"],
    "Governance": ["",
        "1.1 Dimensions, features and indicators of governance",
        "1.2 The federal, provincial and local level governance",
        "1.3 New public governance, co-governance, co-construction and co-production of public services",
        "1.4 Global governance",
        "1.5 Innovative state",
        "1.6 Corporate governance system",
        "1.7 Security challenges and security management in Nepal"
    ],
    "Constitution": ["",
        "2.1 Constitutional development and present constitution of Nepal",
        "2.2 Democracy and human rights",
        "2.3 Geopolitics and rights of land-locked and least developed countries"
    ],
    "Administration": ["",
        "3.1 Public management",
        "3.2 Emerging concept and contemporary issues in administration",
        "3.3 Administrative reform efforts and challenges in Nepal",
        "3.4 Administrative system in SAARC countries : issues and achievements",
        "3.5 Managing human resource in public administration",
        "3.6 Financial control system"
    ],
    "PublicPolicy": ["",
        "4. Process, issues and current trend"
    ],
    "Development": ["",
        "5.1 Aspects of development - economic, social, political and institutional",
        "5.2 Nepalese economy and issues relating to planning, mobilization of resources, growth and development",
        "5.3 Planning in Nepal - efforts, achievements and challenges",
        "5.4 Development partners in development processes and foreign aid mobilization",
        "5.5 Civic engagement in development - civil society, NGOs, CBOs, various groups",
        "5.6 Contemporary development paradigms : Human development, Sustainable development, Public Private Partnership, Economic liberalization and globalization, Economic diplomacy, Intellectual capitals",
        "5.7 Status and consequences of social diversity in Nepal",
        "5.8 Diversity management",
        "5.9 Welfare schemes for weaker/vulnerable sections of the population in Nepal",
        "5
