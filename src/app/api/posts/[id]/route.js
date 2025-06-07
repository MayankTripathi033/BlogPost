import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request) {
  try {
    console.log('API: Starting GET request for post by ID');
    
    
    const id = request.nextUrl.pathname.split("/")[3];    
    

    if (!id) {
      console.error('API: No ID provided in params');
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    console.log('API: Connecting to database');
    await connectDB();
    
    console.log('API: Finding post with ID:', id);
    const post = await Post.findById(id);
    
    if (!post) {
      console.log('API: Post not found for ID:', id);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('API: Successfully found post:', {
      id: post._id,
      title: post.title,
      slug: post.slug
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('API: Error in GET request:', {
      message: error.message,
      stack: error.stack,
    });

    // Check for specific error types
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid post ID format' },
        { status: 400 }
      );
    }

    if (error.name === 'MongoError') {
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    if (!params) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const data = await request.json();
    
    const post = await Post.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API: Error in PUT request:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!params) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('API: Error in DELETE request:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 