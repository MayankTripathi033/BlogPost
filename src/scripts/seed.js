const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  imageUrl: String,
  alt: String,
  description: String,
  content: String,
  metaTitle: String,
  metaDescription: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

const dummyPosts = [
  {
    title: "Getting Started with Next.js 14",
    slug: "getting-started-with-nextjs-14",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    alt: "Code on a laptop screen",
    description: "Learn how to build modern web applications with Next.js 14, the latest version of the React framework.",
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 brings exciting new features and improvements to the React ecosystem. In this comprehensive guide, we'll explore:</p>
      <ul>
        <li>Server Components and their benefits</li>
        <li>Improved routing system</li>
        <li>Enhanced performance optimizations</li>
        <li>Better developer experience</li>
      </ul>
      <h3>Why Choose Next.js 14?</h3>
      <p>Next.js 14 offers significant improvements in performance, developer experience, and scalability. The new App Router provides a more intuitive way to structure your applications, while Server Components reduce client-side JavaScript and improve initial page load times.</p>
      <h3>Getting Started</h3>
      <p>To create a new Next.js 14 project, run:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      <p>This will set up a new project with all the latest features and optimizations.</p>
    `,
    metaTitle: "Next.js 14 Tutorial: Building Modern Web Applications",
    metaDescription: "Learn how to build modern web applications with Next.js 14, including Server Components, App Router, and performance optimizations."
  },
  {
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    alt: "Futuristic web development concept",
    description: "Explore the emerging trends and technologies shaping the future of web development.",
    content: `
      <h2>Emerging Trends in Web Development</h2>
      <p>The web development landscape is constantly evolving. Here are some key trends to watch:</p>
      <ul>
        <li>WebAssembly and its impact on performance</li>
        <li>Edge computing and serverless architectures</li>
        <li>AI-powered development tools</li>
        <li>Progressive Web Apps (PWAs)</li>
      </ul>
      <h3>WebAssembly: The Game Changer</h3>
      <p>WebAssembly is revolutionizing web performance by allowing code written in languages like C++ and Rust to run in the browser at near-native speeds.</p>
      <h3>The Rise of Edge Computing</h3>
      <p>Edge computing brings computation and data storage closer to the location where it's needed, improving response times and saving bandwidth.</p>
    `,
    metaTitle: "Future of Web Development: Trends and Technologies",
    metaDescription: "Discover the emerging trends and technologies that are shaping the future of web development, from WebAssembly to edge computing."
  },
  {
    title: "Building Responsive UIs with Tailwind CSS",
    slug: "responsive-uis-with-tailwind",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    alt: "Responsive design on multiple devices",
    description: "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS.",
    content: `
      <h2>Why Tailwind CSS?</h2>
      <p>Tailwind CSS has revolutionized the way we build user interfaces. Here's why it's becoming the go-to choice:</p>
      <ul>
        <li>Utility-first approach</li>
        <li>Highly customizable</li>
        <li>Smaller bundle sizes</li>
        <li>Better developer experience</li>
      </ul>
      <h3>Getting Started with Tailwind</h3>
      <p>To add Tailwind CSS to your project:</p>
      <pre><code>npm install -D tailwindcss
npx tailwindcss init</code></pre>
      <h3>Best Practices</h3>
      <p>Learn how to create responsive designs that work beautifully across all devices using Tailwind's powerful utility classes.</p>
    `,
    metaTitle: "Responsive UI Design with Tailwind CSS",
    metaDescription: "Learn how to create beautiful, responsive user interfaces using Tailwind CSS's utility-first approach."
  },
  {
    title: "MongoDB Best Practices for Web Applications",
    slug: "mongodb-best-practices",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    alt: "Database server room",
    description: "Learn essential MongoDB best practices for building scalable web applications.",
    content: `
      <h2>MongoDB Architecture</h2>
      <p>Understanding MongoDB's architecture is crucial for building scalable applications:</p>
      <ul>
        <li>Document-based data model</li>
        <li>Indexing strategies</li>
        <li>Sharding and replication</li>
        <li>Performance optimization</li>
      </ul>
      <h3>Schema Design</h3>
      <p>Learn how to design efficient MongoDB schemas that support your application's needs while maintaining performance.</p>
      <h3>Query Optimization</h3>
      <p>Discover techniques for writing efficient queries and using indexes effectively to improve your application's performance.</p>
    `,
    metaTitle: "MongoDB Best Practices for Web Applications",
    metaDescription: "Essential MongoDB best practices for building scalable web applications, including schema design and query optimization."
  },
  {
    title: "The Art of API Design",
    slug: "art-of-api-design",
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    alt: "API architecture diagram",
    description: "Master the principles of designing clean, efficient, and maintainable APIs.",
    content: `
      <h2>API Design Principles</h2>
      <p>Great APIs are built on solid principles:</p>
      <ul>
        <li>RESTful architecture</li>
        <li>Versioning strategies</li>
        <li>Error handling</li>
        <li>Documentation</li>
      </ul>
      <h3>REST Best Practices</h3>
      <p>Learn how to design RESTful APIs that are intuitive, efficient, and easy to maintain.</p>
      <h3>API Security</h3>
      <p>Discover essential security practices for protecting your APIs and user data.</p>
    `,
    metaTitle: "API Design: Principles and Best Practices",
    metaDescription: "Learn the principles of designing clean, efficient, and maintainable APIs with a focus on REST architecture and security."
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await BlogPost.deleteMany({});
    console.log('Cleared existing posts');

    // Insert dummy posts
    const result = await BlogPost.insertMany(dummyPosts);
    console.log(`Successfully inserted ${result.length} posts`);

    // Log the created posts
    console.log('\nCreated posts:');
    result.forEach(post => {
      console.log(`- ${post.title} (${post.slug})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedDatabase(); 