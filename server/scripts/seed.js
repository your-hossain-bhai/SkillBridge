import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import Resource from '../src/models/Resource.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Resource.deleteMany({});
    console.log('Cleared existing data');

    // Seed demo user
    const passwordHash = await bcrypt.hash('password123', 10);
    const demoUser = new User({
      fullName: 'Alex Johnson',
      email: 'test@example.com',
      passwordHash,
      education: 'Bachelor\'s in Computer Science',
      department: 'Engineering',
      experienceLevel: 'Junior',
      preferredTrack: 'Full Stack Development',
      skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'MongoDB'],
      cvText: 'Experienced junior developer with strong foundation in MERN stack. Passionate about building scalable web applications.'
    });
    await demoUser.save();
    console.log('Seeded demo user: test@example.com / password123');

    // Seed jobs
    const jobs = [
      {
        title: 'Frontend Developer Intern',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
        recommendedExperience: '0-1 years',
        jobType: 'Internship',
        description: 'Join our frontend team to build modern web applications using React and modern JavaScript. Great learning opportunity for students and recent graduates.'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        requiredSkills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
        recommendedExperience: '1-3 years',
        jobType: 'Full-time',
        description: 'We are looking for a full stack developer to help build our next-generation platform. You will work with React, Node.js, and MongoDB.'
      },
      {
        title: 'Junior Software Engineer',
        company: 'BigTech Inc',
        location: 'New York, NY',
        requiredSkills: ['JavaScript', 'Python', 'SQL'],
        recommendedExperience: '0-2 years',
        jobType: 'Full-time',
        description: 'Entry-level position for recent graduates. Work on exciting projects with mentorship from senior engineers.'
      },
      {
        title: 'React Developer',
        company: 'WebAgency',
        location: 'Austin, TX',
        requiredSkills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
        recommendedExperience: '1-2 years',
        jobType: 'Full-time',
        description: 'Build beautiful user interfaces with React. Experience with modern CSS frameworks and state management required.'
      },
      {
        title: 'Backend Developer',
        company: 'CloudServices',
        location: 'Seattle, WA',
        requiredSkills: ['Node.js', 'MongoDB', 'Express', 'REST API'],
        recommendedExperience: '2-4 years',
        jobType: 'Full-time',
        description: 'Design and implement scalable backend services. Experience with microservices architecture preferred.'
      },
      {
        title: 'Web Development Apprentice',
        company: 'LearnTech',
        location: 'Chicago, IL',
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        recommendedExperience: '0 years',
        jobType: 'Apprenticeship',
        description: 'Paid apprenticeship program for aspiring web developers. Learn on the job with structured mentorship.'
      },
      {
        title: 'Freelance Frontend Developer',
        company: 'FreelanceHub',
        location: 'Remote',
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        recommendedExperience: '1+ years',
        jobType: 'Freelance',
        description: 'Work on diverse client projects. Flexible schedule, remote work. Build your portfolio while earning.'
      },
      {
        title: 'Part-time Web Developer',
        company: 'LocalBusiness',
        location: 'Portland, OR',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
        recommendedExperience: '0-1 years',
        jobType: 'Part-time',
        description: 'Perfect for students or those looking for flexible hours. Help small businesses establish their online presence.'
      },
      {
        title: 'MERN Stack Developer',
        company: 'DevStudio',
        location: 'Remote',
        requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js'],
        recommendedExperience: '2-3 years',
        jobType: 'Full-time',
        description: 'Join our team building modern web applications. Full MERN stack experience required.'
      },
      {
        title: 'JavaScript Developer',
        company: 'CodeMasters',
        location: 'Boston, MA',
        requiredSkills: ['JavaScript', 'ES6+', 'Async Programming'],
        recommendedExperience: '1-2 years',
        jobType: 'Full-time',
        description: 'Work on cutting-edge JavaScript projects. Strong understanding of modern JS features required.'
      },
      {
        title: 'UI/UX Developer',
        company: 'DesignFirst',
        location: 'Los Angeles, CA',
        requiredSkills: ['React', 'CSS', 'Design Systems', 'Figma'],
        recommendedExperience: '1-3 years',
        jobType: 'Full-time',
        description: 'Bridge the gap between design and development. Create beautiful, accessible user interfaces.'
      },
      {
        title: 'Database Developer',
        company: 'DataSolutions',
        location: 'Denver, CO',
        requiredSkills: ['MongoDB', 'SQL', 'Database Design'],
        recommendedExperience: '2-4 years',
        jobType: 'Full-time',
        description: 'Design and optimize database schemas. Experience with both SQL and NoSQL databases.'
      },
      {
        title: 'API Developer',
        company: 'IntegrationPro',
        location: 'Remote',
        requiredSkills: ['Node.js', 'REST API', 'GraphQL', 'Express'],
        recommendedExperience: '2-3 years',
        jobType: 'Contract',
        description: 'Build robust APIs for enterprise clients. Experience with API design and documentation required.'
      },
      {
        title: 'Junior Full Stack Developer',
        company: 'GrowthStartup',
        location: 'Miami, FL',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        recommendedExperience: '0-2 years',
        jobType: 'Full-time',
        description: 'Fast-growing startup looking for passionate developers. Learn and grow with us!'
      },
      {
        title: 'Web Development Intern',
        company: 'EduTech',
        location: 'Remote',
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        recommendedExperience: '0 years',
        jobType: 'Internship',
        description: 'Summer internship for students. Work on real projects and build your portfolio.'
      },
      {
        title: 'Frontend Engineer',
        company: 'FinTech Solutions',
        location: 'New York, NY',
        requiredSkills: ['React', 'TypeScript', 'Redux', 'Testing'],
        recommendedExperience: '3-5 years',
        jobType: 'Full-time',
        description: 'Build financial applications with high standards for quality and security.'
      },
      {
        title: 'Backend Engineer',
        company: 'ScaleUp',
        location: 'San Francisco, CA',
        requiredSkills: ['Node.js', 'MongoDB', 'Redis', 'Docker'],
        recommendedExperience: '3-5 years',
        jobType: 'Full-time',
        description: 'Work on high-traffic applications. Experience with scaling and performance optimization required.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        location: 'Remote',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
        recommendedExperience: '2-4 years',
        jobType: 'Full-time',
        description: 'Build innovative products from concept to deployment. Full stack experience with cloud services.'
      }
    ];

    await Job.insertMany(jobs);
    console.log(`Seeded ${jobs.length} jobs`);

    // Seed resources
    const resources = [
      {
        title: 'Complete React Developer Course',
        platform: 'Udemy',
        url: 'https://www.udemy.com/react-course',
        relatedSkills: ['React', 'JavaScript', 'Frontend'],
        costType: 'Paid',
        price: 89.99,
        description: 'Master React from basics to advanced. Build real-world projects and learn best practices.'
      },
      {
        title: 'JavaScript: The Complete Guide',
        platform: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/javascript',
        relatedSkills: ['JavaScript', 'Programming Fundamentals'],
        costType: 'Free',
        price: 0,
        description: 'Comprehensive JavaScript course covering ES6+, async programming, and modern patterns.'
      },
      {
        title: 'Node.js Masterclass',
        platform: 'Coursera',
        url: 'https://www.coursera.org/nodejs',
        relatedSkills: ['Node.js', 'Backend', 'Express'],
        costType: 'Paid',
        price: 49.99,
        description: 'Learn to build scalable backend applications with Node.js and Express.'
      },
      {
        title: 'MongoDB University',
        platform: 'MongoDB',
        url: 'https://university.mongodb.com',
        relatedSkills: ['MongoDB', 'Database', 'NoSQL'],
        costType: 'Free',
        price: 0,
        description: 'Official MongoDB courses covering database design, queries, and best practices.'
      },
      {
        title: 'HTML & CSS Basics',
        platform: 'Codecademy',
        url: 'https://www.codecademy.com/html-css',
        relatedSkills: ['HTML', 'CSS', 'Web Development'],
        costType: 'Free',
        price: 0,
        description: 'Learn the fundamentals of web development with hands-on exercises.'
      },
      {
        title: 'Python for Data Science',
        platform: 'edX',
        url: 'https://www.edx.org/python-data',
        relatedSkills: ['Python', 'Data Science', 'Analytics'],
        costType: 'Paid',
        price: 199.99,
        description: 'Comprehensive course on using Python for data analysis and machine learning.'
      },
      {
        title: 'SQL Fundamentals',
        platform: 'Khan Academy',
        url: 'https://www.khanacademy.org/sql',
        relatedSkills: ['SQL', 'Database', 'Data Querying'],
        costType: 'Free',
        price: 0,
        description: 'Learn SQL from scratch. Perfect for beginners starting with databases.'
      },
      {
        title: 'UI/UX Design Principles',
        platform: 'Interaction Design Foundation',
        url: 'https://www.interaction-design.org/ux',
        relatedSkills: ['Design', 'UI/UX', 'User Experience'],
        costType: 'Paid',
        price: 16.99,
        description: 'Master the principles of user-centered design and create better user experiences.'
      },
      {
        title: 'Digital Marketing Essentials',
        platform: 'Google Digital Garage',
        url: 'https://learndigital.withgoogle.com',
        relatedSkills: ['Marketing', 'Digital Marketing', 'SEO'],
        costType: 'Free',
        price: 0,
        description: 'Free course covering SEO, social media marketing, and digital advertising.'
      },
      {
        title: 'Communication Skills Workshop',
        platform: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/communication',
        relatedSkills: ['Communication', 'Soft Skills', 'Professional Development'],
        costType: 'Paid',
        price: 29.99,
        description: 'Improve your professional communication skills for better workplace collaboration.'
      },
      {
        title: 'Advanced React Patterns',
        platform: 'Frontend Masters',
        url: 'https://frontendmasters.com/react-advanced',
        relatedSkills: ['React', 'Advanced Patterns', 'Performance'],
        costType: 'Paid',
        price: 39.99,
        description: 'Deep dive into advanced React patterns, hooks, and performance optimization.'
      },
      {
        title: 'Express.js API Development',
        platform: 'YouTube',
        url: 'https://www.youtube.com/express-api',
        relatedSkills: ['Express', 'REST API', 'Backend'],
        costType: 'Free',
        price: 0,
        description: 'Free tutorial series on building RESTful APIs with Express.js.'
      },
      {
        title: 'Full Stack Web Development Bootcamp',
        platform: 'The Odin Project',
        url: 'https://www.theodinproject.com',
        relatedSkills: ['Full Stack', 'Web Development', 'MERN'],
        costType: 'Free',
        price: 0,
        description: 'Comprehensive free curriculum covering full stack web development.'
      },
      {
        title: 'TypeScript for JavaScript Developers',
        platform: 'Pluralsight',
        url: 'https://www.pluralsight.com/typescript',
        relatedSkills: ['TypeScript', 'JavaScript', 'Type Safety'],
        costType: 'Paid',
        price: 29.99,
        description: 'Learn TypeScript to write more maintainable and scalable JavaScript code.'
      },
      {
        title: 'GraphQL API Development',
        platform: 'Apollo GraphQL',
        url: 'https://www.apollographql.com/tutorials',
        relatedSkills: ['GraphQL', 'API', 'Backend'],
        costType: 'Free',
        price: 0,
        description: 'Official Apollo tutorials for building GraphQL APIs and clients.'
      },
      {
        title: 'Docker & Containerization',
        platform: 'Docker Official',
        url: 'https://docs.docker.com/get-started',
        relatedSkills: ['Docker', 'DevOps', 'Containers'],
        costType: 'Free',
        price: 0,
        description: 'Learn containerization with Docker. Essential for modern development workflows.'
      },
      {
        title: 'AWS Cloud Practitioner',
        platform: 'AWS Training',
        url: 'https://aws.amazon.com/training',
        relatedSkills: ['AWS', 'Cloud Computing', 'DevOps'],
        costType: 'Free',
        price: 0,
        description: 'Free AWS training to get started with cloud computing and services.'
      },
      {
        title: 'Git & Version Control',
        platform: 'Atlassian',
        url: 'https://www.atlassian.com/git/tutorials',
        relatedSkills: ['Git', 'Version Control', 'Collaboration'],
        costType: 'Free',
        price: 0,
        description: 'Master Git and version control workflows for team collaboration.'
      },
      {
        title: 'Testing with Jest',
        platform: 'Jest Official',
        url: 'https://jestjs.io/docs/getting-started',
        relatedSkills: ['Testing', 'Jest', 'Quality Assurance'],
        costType: 'Free',
        price: 0,
        description: 'Learn to write and run tests with Jest, the popular JavaScript testing framework.'
      },
      {
        title: 'Web Accessibility (a11y)',
        platform: 'WebAIM',
        url: 'https://webaim.org/resources',
        relatedSkills: ['Accessibility', 'Web Standards', 'Inclusive Design'],
        costType: 'Free',
        price: 0,
        description: 'Learn to build accessible web applications that work for everyone.'
      }
    ];

    await Resource.insertMany(resources);
    console.log(`Seeded ${resources.length} resources`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

