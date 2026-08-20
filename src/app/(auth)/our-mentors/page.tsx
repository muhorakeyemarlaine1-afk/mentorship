"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

// ── Types ────────────────────────────────────────────────────────────────────

interface Mentor {
    id: string
    name: string
    role: string
    org: string
    bio: string
    tags: string[]
    rating: number
    sessions: number
    img: string
    available: boolean
}

interface Category {
    id: string
    label: string
    color: string
    bg: string
    textOnColor: string
    icon: React.ReactNode
    mentors: Mentor[]
}

// ── Mentor Data ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
    // 1. CAREER ─────────────────────────────────────────────────────────────────
    {
        id: "career",
        label: "Career",
        color: "#1B4B8A",
        bg: "#EEF3FA",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M8 7V5a4 4 0 018 0v2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path d="M2 13h20" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
        mentors: [
            {
                id: "c1",
                name: "Chidi Okafor",
                role: "Senior Product Manager",
                org: "Microsoft Lagos",
                bio: "Former banker turned tech PM. Helped 200+ youth transition careers into tech. Specialises in African talent breaking into global companies.",
                tags: ["Tech Careers", "Career Switch", "Product Management"],
                rating: 4.9,
                sessions: 312,
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "c2",
                name: "Fatima Al-Hassan",
                role: "Head of Talent Acquisition",
                org: "Andela",
                bio: "Recruited 1,000+ African engineers globally. Expert in building compelling LinkedIn profiles and navigating hiring processes at top tech companies.",
                tags: ["Recruitment", "LinkedIn", "Tech Hiring"],
                rating: 4.8,
                sessions: 248,
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "c3",
                name: "Emmanuel Adeyemi",
                role: "Management Consultant",
                org: "McKinsey & Company",
                bio: "Cambridge graduate advising youth on consulting careers, case interview mastery, and professional development in high-stakes environments.",
                tags: ["Consulting", "Case Interviews", "MBA Prep"],
                rating: 4.9,
                sessions: 187,
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
            {
                id: "c4",
                name: "Ngozi Eze",
                role: "HR Director",
                org: "Flutterwave",
                bio: "Built HR teams from 10 to 400+ people. Passionate about helping young Africans understand workplace dynamics and negotiate their worth.",
                tags: ["HR Strategy", "Workplace Culture", "Negotiation"],
                rating: 4.7,
                sessions: 203,
                img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
        ],
    },

    // 2. ENTREPRENEURSHIP ────────────────────────────────────────────────────────
    {
        id: "entrepreneurship",
        label: "Entrepreneurship",
        color: "#E07830",
        bg: "#FEF4EC",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                    d="M12 2L3 8v14h18V8L12 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <path
                    d="M9 22V15h6v7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "e1",
                name: "Kwame Asante",
                role: "Founder & CEO",
                org: "AgriTech Ventures",
                bio: "Raised $3M+ for his agri-tech startup. Mentor to 50+ founders across East and West Africa. Specialises in pre-seed fundraising and go-to-market strategy.",
                tags: ["Fundraising", "Startup Strategy", "AgriTech"],
                rating: 4.8,
                sessions: 198,
                img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "e2",
                name: "Amina Diallo",
                role: "Serial Entrepreneur",
                org: "Lagos Founders Hub",
                bio: "3 successful exits. Mentors first-time founders on product-market fit, customer discovery, and building resilient teams in low-resource environments.",
                tags: [
                    "Product-Market Fit",
                    "Customer Discovery",
                    "Team Building",
                ],
                rating: 4.9,
                sessions: 276,
                img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "e3",
                name: "David Kimani",
                role: "VC Partner",
                org: "Novastar Ventures",
                bio: "Invested in 30+ African startups. Helps founders understand how VCs think, structure deals, and build investor-ready businesses.",
                tags: [
                    "Venture Capital",
                    "Deal Structure",
                    "Investor Relations",
                ],
                rating: 4.8,
                sessions: 142,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "e4",
                name: "Sade Bello",
                role: "Founder",
                org: "FashionTech Africa",
                bio: "Built a fashion-tech platform serving 20,000 artisans. Specialist in social enterprise, impact investing, and e-commerce for African markets.",
                tags: ["Social Enterprise", "E-commerce", "Impact Investing"],
                rating: 4.7,
                sessions: 165,
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 3. EDUCATION & SCHOLARSHIPS ────────────────────────────────────────────────
    {
        id: "education",
        label: "Education",
        color: "#2E7D32",
        bg: "#EDF7EE",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                    d="M12 3L2 9l10 6 10-6L12 3z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <path
                    d="M4 11v7c0 2 3.582 3.5 8 3.5s8-1.5 8-3.5v-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "ed1",
                name: "Zara Okonkwo",
                role: "Rhodes Scholar",
                org: "Oxford University",
                bio: "Won the Rhodes Scholarship, Chevening, and MasterCard Foundation awards. Has coached 100+ students into fully-funded international programmes.",
                tags: [
                    "Rhodes Scholarship",
                    "Chevening",
                    "Fully-Funded Programmes",
                ],
                rating: 5.0,
                sessions: 274,
                img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ed2",
                name: "Kofi Mensah",
                role: "Academic Director",
                org: "African Leadership University",
                bio: "Former Harvard graduate student advisor. Expert in personal statements, academic writing, and preparing students for highly competitive programmes.",
                tags: [
                    "Personal Statement",
                    "Academic Writing",
                    "Ivy League Prep",
                ],
                rating: 4.9,
                sessions: 319,
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ed3",
                name: "Miriam Wanjiru",
                role: "Fulbright Alumni & Lecturer",
                org: "University of Nairobi",
                bio: "Guides students through Fulbright, Commonwealth, and Erasmus+ applications. Deep expertise in STEM scholarships for East African students.",
                tags: [
                    "Fulbright",
                    "STEM Scholarships",
                    "Postgraduate Applications",
                ],
                rating: 4.8,
                sessions: 231,
                img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ed4",
                name: "Tariq Moosa",
                role: "Education Consultant",
                org: "Future Africa Institute",
                bio: "Placed over 300 students in universities across the US, UK, Canada, and Europe. Specialist in navigating the entire application cycle from shortlisting to visa.",
                tags: ["University Placement", "Visa Guidance", "Study Abroad"],
                rating: 4.7,
                sessions: 401,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 4. TECHNOLOGY ──────────────────────────────────────────────────────────────
    {
        id: "technology",
        label: "Technology",
        color: "#00838F",
        bg: "#E0F5F7",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect
                    x="2"
                    y="4"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M9 10l-3 3 3 3M15 10l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 20h20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "t1",
                name: "Amara Diallo",
                role: "Senior Software Engineer",
                org: "Google",
                bio: "Full-stack engineer at Google London. Went from self-taught coder in Dakar to landing a FAANG role. Mentors youth on the exact path she took.",
                tags: ["Full-Stack", "FAANG Prep", "Self-Taught Journey"],
                rating: 4.9,
                sessions: 312,
                img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "t2",
                name: "Seun Afolabi",
                role: "AI Research Engineer",
                org: "DeepMind Africa",
                bio: "Researching AI for African language processing. Teaches ML fundamentals, Python, and research methodology to aspiring AI practitioners.",
                tags: ["AI & Machine Learning", "Python", "Research"],
                rating: 4.9,
                sessions: 189,
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "t3",
                name: "Lena Mwangi",
                role: "Cybersecurity Analyst",
                org: "Safaricom",
                bio: "Certified ethical hacker. Mentors students on cybersecurity fundamentals, certifications (CEH, CISSP), and building security careers in Africa.",
                tags: ["Cybersecurity", "Ethical Hacking", "Certifications"],
                rating: 4.8,
                sessions: 156,
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "t4",
                name: "Eze Chukwu",
                role: "Engineering Manager",
                org: "Paystack",
                bio: "Led engineering teams building fintech infrastructure at scale. Mentors on backend engineering, system design, and growing from junior to senior engineer.",
                tags: [
                    "System Design",
                    "Backend Engineering",
                    "Engineering Leadership",
                ],
                rating: 4.7,
                sessions: 224,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 5. MENTAL HEALTH ───────────────────────────────────────────────────────────
    {
        id: "mental-health",
        label: "Mental Health",
        color: "#7B3FA0",
        bg: "#F5EDF9",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                    d="M12 21S3 15.5 3 9a6 6 0 0110.5-4A6 6 0 0121 9c0 6.5-9 12-9 12z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "mh1",
                name: "Naledi Sithole",
                role: "Licensed Clinical Psychologist",
                org: "Mind Matters Africa",
                bio: "Specialises in youth anxiety, depression, and academic pressure. Works with students from 12 African countries. Offers culturally sensitive therapy adapted for African youth.",
                tags: [
                    "Anxiety",
                    "Depression",
                    "Academic Pressure",
                    "Youth Therapy",
                ],
                rating: 4.9,
                sessions: 421,
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "mh2",
                name: "Dr. Babatunde Ojo",
                role: "Psychiatrist & Author",
                org: "Lagos Mental Health Foundation",
                bio: 'Author of "The African Mind Unshackled." Specialises in breaking the stigma around mental health in African communities and working with young men.',
                tags: [
                    "Stigma Breaking",
                    "Young Men",
                    "Community Mental Health",
                ],
                rating: 4.9,
                sessions: 298,
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "mh3",
                name: "Grace Achieng",
                role: "Certified Counselling Psychologist",
                org: "Ubuntu Wellness Centre",
                bio: "Trauma-informed counsellor working with youth affected by family disruption, grief, and identity challenges. Strong in faith-based and culturally contextual approaches.",
                tags: [
                    "Trauma",
                    "Grief",
                    "Identity",
                    "Faith-Based Counselling",
                ],
                rating: 4.8,
                sessions: 334,
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "mh4",
                name: "Yusuf Kamau",
                role: "Life Skills & Resilience Coach",
                org: "Bounce Forward Kenya",
                bio: "Trains young people in emotional regulation, resilience-building, and positive psychology. Runs group workshops for youth in underserved communities.",
                tags: [
                    "Resilience",
                    "Emotional Intelligence",
                    "Positive Psychology",
                ],
                rating: 4.7,
                sessions: 267,
                img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 6. FINANCIAL LITERACY ──────────────────────────────────────────────────────
    {
        id: "financial-literacy",
        label: "Financial Literacy",
        color: "#1565C0",
        bg: "#E8F0FB",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M12 6v1.5M12 16.5V18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path
                    d="M9 9.5C9 8.4 10.3 7.5 12 7.5s3 .9 3 2c0 1.2-1.2 1.6-3 2s-3 .8-3 2c0 1.1 1.3 2 3 2s3-.9 3-2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "fl1",
                name: "Obiageli Nwosu",
                role: "Certified Financial Planner",
                org: "Wealth Bridge Africa",
                bio: "Helped 500+ young Africans build their first investment portfolio. Specialises in making stock markets, bonds, and crypto understandable for beginners.",
                tags: ["Investing", "Stock Market", "Portfolio Building"],
                rating: 4.9,
                sessions: 356,
                img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "fl2",
                name: "Tunde Bello",
                role: "Investment Banker",
                org: "Standard Bank",
                bio: "Decade of experience in African capital markets. Breaks down complex financial concepts into practical money habits anyone can implement today.",
                tags: ["Capital Markets", "Financial Habits", "Banking"],
                rating: 4.8,
                sessions: 201,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "fl3",
                name: "Adaeze Obi",
                role: "Microfinance Expert",
                org: "Kiva Africa",
                bio: "Works with youth entrepreneurs on accessing microloans, understanding credit, and using mobile money platforms to save and grow income.",
                tags: ["Microfinance", "Mobile Money", "Credit Building"],
                rating: 4.8,
                sessions: 178,
                img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "fl4",
                name: "James Muthoni",
                role: "Tax & Compliance Advisor",
                org: "Deloitte East Africa",
                bio: "Teaches young entrepreneurs and freelancers how to manage taxes, register businesses, and stay financially compliant from day one.",
                tags: ["Tax Planning", "Business Registration", "Compliance"],
                rating: 4.6,
                sessions: 134,
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 7. LEADERSHIP ──────────────────────────────────────────────────────────────
    {
        id: "leadership",
        label: "Leadership",
        color: "#B71C1C",
        bg: "#FDECEA",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M4 21v-1a8 8 0 0116 0v1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path
                    d="M17 11a5 5 0 010 8M7 11a5 5 0 000 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "l1",
                name: "Adewale Bankole",
                role: "CEO & Executive Coach",
                org: "Pan-African Leadership Institute",
                bio: "Former VP at MTN Group. Trained 2,000+ African leaders. Specialises in developing the next generation of transformational leaders on the continent.",
                tags: [
                    "Executive Leadership",
                    "Transformational Leadership",
                    "Corporate Strategy",
                ],
                rating: 4.9,
                sessions: 389,
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "l2",
                name: "Priya Naidoo",
                role: "Community Leadership Trainer",
                org: "Ubuntu Leadership Academy",
                bio: "Specialises in grassroots leadership — building young people to lead communities, NGOs, and civic movements. Expert in servant leadership and Ubuntu philosophy.",
                tags: [
                    "Community Leadership",
                    "Servant Leadership",
                    "Civic Engagement",
                ],
                rating: 4.8,
                sessions: 267,
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "l3",
                name: "Musa Ibrahim",
                role: "Political Leader & Youth Advocate",
                org: "Ghana's National Youth Authority",
                bio: "Former National Youth Council chair. Guides youth aspiring to public service, political leadership, and policy-making roles across Africa.",
                tags: [
                    "Political Leadership",
                    "Public Policy",
                    "Youth Advocacy",
                ],
                rating: 4.7,
                sessions: 145,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "l4",
                name: "Diana Akello",
                role: "Student Leadership Coach",
                org: "Makerere University",
                bio: "Works with student leaders, SRC presidents, and young professionals stepping into their first leadership roles. Expert in imposter syndrome and building authentic authority.",
                tags: [
                    "Student Leadership",
                    "First-Time Managers",
                    "Imposter Syndrome",
                ],
                rating: 4.8,
                sessions: 312,
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 8. WOMEN EMPOWERMENT ───────────────────────────────────────────────────────
    {
        id: "women-empowerment",
        label: "Women Empowerment",
        color: "#C2185B",
        bg: "#FCE4EC",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle
                    cx="12"
                    cy="10"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M12 15v7M9 19h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path
                    d="M6 6L3 3M18 6l3-3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "we1",
                name: "Chioma Osuji",
                role: "Women in Tech Advocate",
                org: "SheLeads Africa",
                bio: "Founded a community of 80,000+ African women in business and tech. Helps young women break into male-dominated fields with strategy, networks, and self-belief.",
                tags: [
                    "Women in Tech",
                    "Community Building",
                    "Career Strategy",
                ],
                rating: 5.0,
                sessions: 445,
                img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "we2",
                name: "Dr. Amara Sow",
                role: "Gender & Development Specialist",
                org: "UN Women Africa",
                bio: "Policy expert on gender equity in African institutions. Mentors young women on navigating systemic barriers, policy advocacy, and international development careers.",
                tags: ["Gender Policy", "Development", "International Careers"],
                rating: 4.9,
                sessions: 213,
                img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "we3",
                name: "Josephine Atieno",
                role: "Entrepreneur & Investor",
                org: "Wanafunzi Capital",
                bio: "Manages an impact fund specifically investing in women-led African businesses. Coaches young female entrepreneurs on building investor-ready businesses.",
                tags: [
                    "Female Entrepreneurship",
                    "Impact Investing",
                    "Business Mentorship",
                ],
                rating: 4.8,
                sessions: 189,
                img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "we4",
                name: "Fatou Diallo",
                role: "Confidence & Presence Coach",
                org: "Rise Women Institute",
                bio: "Specialises in public speaking, executive presence, and helping women own their authority in rooms where they are underrepresented.",
                tags: ["Public Speaking", "Executive Presence", "Confidence"],
                rating: 4.9,
                sessions: 276,
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 9. LIFE COACHING ───────────────────────────────────────────────────────────
    {
        id: "life-coaching",
        label: "Life Coaching",
        color: "#E07830",
        bg: "#FEF4EC",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                    d="M12 2l2.09 6.26H20l-5.18 3.76 1.97 6.08L12 14.27l-4.79 3.83 1.97-6.08L4 8.26h5.91L12 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "lc1",
                name: "Isaac Mensah",
                role: "ICF Certified Life Coach",
                org: "Thrive Africa Coaching",
                bio: "International Coaching Federation certified with 2,000+ coaching hours. Specialises in helping young adults find clarity, overcome self-doubt, and move from stuck to momentum.",
                tags: [
                    "ICF Certified",
                    "Clarity Coaching",
                    "Self-Doubt",
                    "Purpose Finding",
                ],
                rating: 4.9,
                sessions: 498,
                img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "lc2",
                name: "Nana Adjoa",
                role: "Mindset & Habits Coach",
                org: "The Grow Institute",
                bio: 'Author of "Break the Cycle." Works with youth on breaking generational patterns, building morning routines, and developing the discipline needed to achieve big goals.',
                tags: ["Mindset", "Habit Formation", "Generational Patterns"],
                rating: 4.8,
                sessions: 323,
                img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "lc3",
                name: "Emeka Obi",
                role: "Transition & Career Life Coach",
                org: "Pivot West Africa",
                bio: "Specialises in major life transitions — gap years, degree changes, moving countries, career pivots. Helps young adults navigate uncertainty with confidence.",
                tags: [
                    "Life Transitions",
                    "Career Pivots",
                    "Gap Year",
                    "Uncertainty",
                ],
                rating: 4.8,
                sessions: 256,
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "lc4",
                name: "Blessing Chukwu",
                role: "Spiritual & Holistic Coach",
                org: "Whole Life Coaching Africa",
                bio: "Integrates faith, mindfulness, and evidence-based coaching for youth seeking alignment between their spiritual values and life ambitions.",
                tags: ["Holistic Coaching", "Faith Integration", "Mindfulness"],
                rating: 4.7,
                sessions: 188,
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },

    // 10. AGRICULTURE & GREEN ECONOMY ───────────────────────────────────────────
    {
        id: "agriculture",
        label: "Agriculture",
        color: "#1B5E20",
        bg: "#E8F5E9",
        textOnColor: "#fff",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                    d="M12 22V14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path
                    d="M12 14C12 14 6 12 4 4c5-2 11 2 11 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 14c0 0 6-3 8-11-5-2-11 2-11 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <path
                    d="M5 22h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
        mentors: [
            {
                id: "ag1",
                name: "Dr. Wanjiku Kamau",
                role: "Agronomist & Agribusiness Consultant",
                org: "Alliance of Bioversity International",
                bio: "PhD in Agricultural Economics. Helps young farmers and agri-entrepreneurs access financing, adopt modern techniques, and build profitable sustainable farms.",
                tags: [
                    "Agribusiness",
                    "Sustainable Farming",
                    "Agricultural Finance",
                ],
                rating: 4.9,
                sessions: 234,
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ag2",
                name: "Kofi Boateng",
                role: "Green Economy Entrepreneur",
                org: "Eco-Ventures Ghana",
                bio: "Built a solar-powered cold chain startup serving 5,000 smallholder farmers. Mentors youth on green business models, climate financing, and impact entrepreneurship.",
                tags: [
                    "Green Economy",
                    "Climate Tech",
                    "Impact Entrepreneurship",
                ],
                rating: 4.8,
                sessions: 167,
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ag3",
                name: "Amina Traore",
                role: "Climate Change & Food Systems Expert",
                org: "African Climate Foundation",
                bio: "Works at the intersection of climate science and food security. Guides youth on careers in climate policy, conservation agriculture, and resilient food systems.",
                tags: [
                    "Climate Policy",
                    "Food Security",
                    "Conservation Agriculture",
                ],
                rating: 4.8,
                sessions: 143,
                img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
                available: true,
            },
            {
                id: "ag4",
                name: "Peter Mutua",
                role: "Digital Agriculture Specialist",
                org: "iShamba Kenya",
                bio: "Pioneer in digital farming advisory. Teaches youth to use drone tech, satellite data, and mobile platforms to modernise farming and improve yields.",
                tags: ["Digital Farming", "Precision Agriculture", "AgriTech"],
                rating: 4.7,
                sessions: 112,
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
                available: false,
            },
        ],
    },
]

const ALL_CATEGORY: Category = {
    id: "all",
    label: "All",
    color: "#1B4B8A",
    bg: "#EEF3FA",
    textOnColor: "#fff",
    icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    ),
    mentors: CATEGORIES.flatMap((c) => c.mentors),
}

const TABS: Category[] = [ALL_CATEGORY, ...CATEGORIES]

// ── Subcomponents ────────────────────────────────────────────────────────────

function MentorCard({
    mentor,
    categoryColor,
}: {
    mentor: Mentor
    categoryColor: string
}) {
    return (
        <div className="rounded-2xl overflow-hidden border border-[#E2EAF4] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative h-48 bg-[#EEF3FA]">
                <img
                    src={mentor.img}
                    alt={mentor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: mentor.available
                                ? "#DCFCE7"
                                : "#F3F4F6",
                            color: mentor.available ? "#15803D" : "#6B7280",
                        }}
                    >
                        {mentor.available ? "● Available" : "○ Busy"}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-bold text-[#0D1F3C] text-base">
                    {mentor.name}
                </h3>
                <p
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: categoryColor,
                    }}
                    className="text-sm mt-0.5 mb-1"
                >
                    {mentor.role}
                </p>
                <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-xs text-[#9CAFC8] mb-3"
                >
                    {mentor.org}
                </p>
                <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-[#4A6080] text-sm leading-relaxed mb-4 line-clamp-3"
                >
                    {mentor.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                                backgroundColor: categoryColor + "14",
                                color: categoryColor,
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                        <svg
                            viewBox="0 0 16 16"
                            className="w-3.5 h-3.5 text-[#E07830]"
                            fill="currentColor"
                        >
                            <path d="M8 1l1.97 4.4L15 6.27l-3.5 3.41.83 4.82L8 12.1 3.67 14.5l.83-4.82L1 6.27l5.03-.87L8 1z" />
                        </svg>
                        <span className="text-sm font-semibold text-[#0D1F3C]">
                            {mentor.rating}
                        </span>
                    </div>
                    <span
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-xs text-[#9CAFC8]"
                    >
                        {mentor.sessions.toLocaleString()} sessions
                    </span>
                </div>

                {mentor.available ? (
                    <Link
                        href="/get-started"
                        className="w-full py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] flex items-center justify-center"
                        style={{
                            backgroundColor: categoryColor,
                            color: "#fff",
                        }}
                    >
                        Book a Session
                    </Link>
                ) : (
                    <button
                        className="w-full py-2.5 rounded-full text-sm font-bold transition-all"
                        style={{
                            backgroundColor: "#F3F4F6",
                            color: "#9CA3AF",
                            cursor: "not-allowed",
                        }}
                        disabled
                    >
                        Join Waitlist
                    </button>
                )}
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MentorsPage() {
    const [activeCategory, setActiveCategory] = useState("all")
    const [search, setSearch] = useState("")
    const [filterAvailable, setFilterAvailable] = useState(false)

    const current = TABS.find((c) => c.id === activeCategory)!

    const filteredMentors = current.mentors.filter((m) => {
        const matchSearch =
            !search ||
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.tags.some((t) =>
                t.toLowerCase().includes(search.toLowerCase()),
            ) ||
            m.bio.toLowerCase().includes(search.toLowerCase())
        const matchAvailable = !filterAvailable || m.available
        return matchSearch && matchAvailable
    })

    const totalMentors = CATEGORIES.reduce(
        (sum, c) => sum + c.mentors.length,
        0,
    )

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen bg-white"
        >
            {/* ── NAV ─────────────────────────────────────────────────── */}
            <Navbar
                search={search}
                onSearchChange={setSearch}
                filterAvailable={filterAvailable}
                onToggleFilter={() => setFilterAvailable(!filterAvailable)}
            />

            {/* ── PAGE HEADER ────────────────────────────────────────── */}
            <div className="pt-16 bg-[#0D2B5E] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#1B4B8A]/60 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E07830]/10 -translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-10">
                    <div className="text-[#E07830] text-xs font-bold uppercase tracking-widest mb-2">
                        mentorship.globalyouthemerge.org
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Find Your Mentor
                    </h1>
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-blue-200 text-base mb-8 max-w-xl"
                    >
                        Browse {totalMentors} expert mentors across every
                        area of your growth.
                    </p>

                    {/* Category tabs */}
                    <div
                        className="flex gap-2 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {TABS.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0"
                                style={{
                                    backgroundColor:
                                        activeCategory === cat.id
                                            ? cat.color
                                            : "rgba(255,255,255,0.1)",
                                    color:
                                        activeCategory === cat.id
                                            ? cat.textOnColor
                                            : "rgba(255,255,255,0.7)",
                                    border:
                                        activeCategory === cat.id
                                            ? `2px solid ${cat.color}`
                                            : "2px solid transparent",
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            activeCategory === cat.id
                                                ? cat.textOnColor
                                                : "rgba(255,255,255,0.7)",
                                    }}
                                >
                                    {cat.icon}
                                </span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CATEGORY CONTENT ───────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Section heading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    backgroundColor: current.color + "18",
                                    color: current.color,
                                }}
                            >
                                {current.icon}
                            </div>
                            <h2 className="text-2xl font-extrabold text-[#0D1F3C]">
                                {current.label} Mentors
                            </h2>
                        </div>
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-sm"
                        >
                            {
                                current.mentors.filter((m) => m.available)
                                    .length
                            }{" "}
                            available now ·{" "}
                            {current.mentors.length} total mentors
                        </p>
                    </div>
                    {search && (
                        <div className="text-sm text-[#6B84A3]">
                            {filteredMentors.length} result
                            {filteredMentors.length !== 1 ? "s" : ""} for
                            &ldquo;{search}&rdquo;
                        </div>
                    )}
                </div>

                {filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMentors.map((mentor) => (
                            <MentorCard
                                key={mentor.id}
                                mentor={mentor}
                                categoryColor={current.color}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-[#9CAFC8]">
                        <svg
                            viewBox="0 0 64 64"
                            fill="none"
                            className="w-16 h-16 mx-auto mb-4 opacity-40"
                        >
                            <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                d="M44 44l12 12"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <p className="text-lg font-semibold">
                            No mentors found
                        </p>
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-sm mt-1"
                        >
                            Try adjusting your search or clearing the available
                            filter.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("")
                                setFilterAvailable(false)
                            }}
                            className="mt-4 px-6 py-2 rounded-full border border-[#D9E5F5] text-sm font-medium text-[#1B4B8A] hover:bg-[#EEF3FA] transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="bg-[#0D1F3C] text-white py-8 mt-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-8 w-auto brightness-0 invert"
                        />
                        <span
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-sm"
                        >
                            © 2025 Global Youth Emerge ·
                            mentorship.globalyouthemerge.org
                        </span>
                    </div>
                    <div className="flex gap-5">
                        {["Privacy", "Terms", "Contact"].map((l) => (
                            <a
                                key={l}
                                href="#"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                className="text-[#6B84A3] text-xs hover:text-white transition-colors"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
