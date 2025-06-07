import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

// GET all posts
export async function GET() {
  try {
    console.log('API: Connecting to database...');
    await connectDB();
    
    console.log('API: Fetching all posts...');
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .lean();
        
    // Ensure all required fields are present
    const validPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      imageUrl: post.imageUrl || '',
      alt: post.alt || post.title,
      description: post.description || '',
      content: post.content || '',
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date()
    }));

    console.log('Fetched posts with image URLs:', validPosts.map(post => ({
      id: post._id,
      title: post.title,
      imageUrl: post.imageUrl
    })));

    return NextResponse.json(validPosts);
  } catch (error) {
    console.error('API: Error fetching posts:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST new post
export async function POST(request) {
  try {
    console.log('API: Connecting to database...');
    await connectDB();
    
    const data = await request.json();
    console.log('Received post data:', data);

    // Validate required fields
    if (!data.title || !data.description || !data.content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }

    // Create new post
    const post = new Post({
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      alt: data.alt || data.title,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.description,
    });

    console.log('Creating new post with data:', {
      title: post.title,
      imageUrl: post.imageUrl,
      alt: post.alt
    });

    await post.save();
    console.log('Post saved successfully:', {
      id: post._id,
      title: post.title,
      imageUrl: post.imageUrl
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('API: Error creating post:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 