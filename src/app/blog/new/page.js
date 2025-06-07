'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';

import axios from 'axios';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NewBlogPost() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    alt: '',
    description: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      alt: ''
    }));
    setUploadProgress(0);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(formData);
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.content) {
        throw new Error('Title, description, and content are required');
      }

      if (!formData.imageUrl) {
        throw new Error('Please upload an image for the blog post');
      }

      const content = editorRef.current.getContent();
      if (!content) {
        throw new Error('Please add some content to your blog post');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      router.push(`/blog/${data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result;

        // Upload to Cloudinary
        const response = await axios.post('/api/upload', {
          file: base64File
        }, {
          onUploadProgress: (progressEvent) => {
            // Calculate progress with a smoother curve
            const rawProgress = (progressEvent.loaded * 100) / progressEvent.total;
            const smoothProgress = Math.min(
              Math.round(rawProgress * 0.95), // Cap at 95% until complete
              95
            );
            setUploadProgress(smoothProgress);
          }
        });

        // Set to 100% when complete
        setUploadProgress(100);
        setFormData(prev => ({
          ...prev,
          imageUrl: response.data.secure_url,
          alt: file.name
        }));
      };
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      variants={formVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gray-900"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Create New Blog Post</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-white mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="metaTitle" className="block text-white mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  required
                  maxLength={60}
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  maxLength={200}
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-white mb-2">
                  Meta Description *
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  required
                  maxLength={160}
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">
                Featured Image *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer"
                >
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt={formData.alt}
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">
                        Drag and drop an image here, or click to select
                      </p>
                      <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Select Image
                      </span>
                    </div>
                  )}
                </label>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                        duration: 0.3
                      }}
                    />
                  </div>
                  <motion.p
                    className="text-sm text-gray-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Uploading: {uploadProgress}%
                  </motion.p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Content *
              </label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue=""
                init={{
                  height: 500,
                  menubar: true,
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: white; }',
                  setup: (editor) => {
                    editor.on('error', (e) => {
                      console.error('TinyMCE error:', e);
                      setError('Failed to load editor. Please try refreshing the page.');
                    });
                  }
                }}
                onEditorChange={(content) => {
                  setFormData(prev => ({
                    ...prev,
                    content
                  }));
                }}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.main>
  );
} 