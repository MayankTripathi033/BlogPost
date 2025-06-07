'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { use } from 'react';
import Image from 'next/image';

export default function BlogPost({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching post with ID:', id);
        const response = await fetch(`/api/posts/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched post data:', data);
        
        if (!data) {
          throw new Error('No data received from server');
        }

        setPost(data);
      } catch (err) {
        console.error('Detailed fetch error:', {
          message: err.message,
          stack: err.stack,
          id: id
        });
        setError(err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (mounted && id) {
      fetchPost();
    }
  }, [id, mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6">
            <div className="relative">
              {/* Animated book icon */}
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg transform rotate-12 animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-blue-400 rounded-lg transform -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 border-4 border-blue-300 rounded-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              {/* Animated dots */}
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">Loading Stories</h2>
              <p className="text-gray-600 animate-pulse">Crafting your reading experience...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Post</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/blog')}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Back to Blog
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/blog')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {post.imageUrl ? (
            <div className="relative h-96 w-full">
              <Image
                src={post.imageUrl}
                alt={post.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          
          <div className="p-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              {post.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
} 