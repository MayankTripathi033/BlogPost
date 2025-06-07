'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';


export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching posts...');
        const response = await fetch('/api/posts');

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        console.log('Fetched posts:', data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    fetchPosts();
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Blog Posts</h1>
          <Link href="/blog/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Post
            </motion.button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No posts found</p>
          <Link href="/blog/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Post
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Blog Posts</h1>
        <Link href="/blog/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Post
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <Link href={`/blog/${post._id}`} key={post._id} className="block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full group"
            >
              <div className="relative h-64 w-full">
                {post.imageUrl ? (
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.alt || post.title}
                      className="object-cover w-full h-full"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      priority={index < 4} // Only prioritize first few images
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gradient-to-t from-black/60 to-transparent items-center justify-center">
                      <span className="text-gray-200">No image available</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>

              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3 text-lg">
                  {post.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <motion.span
                    className="text-blue-400 hover:text-blue-300 transition-colors text-lg flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    Read more
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
} 