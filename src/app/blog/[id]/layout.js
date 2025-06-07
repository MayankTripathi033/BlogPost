import { headers } from 'next/headers';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }) {
  try {
    // Get the host from headers first (this needs to be awaited)
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Get the ID from params (no need to await as params is already resolved)
    const { id } = await params;    

    // Fetch blog post data
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      next: { revalidate: 3600 } // Optional: add revalidation
    });
    

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const post = await response.json();    

    return {
      title: `${post.title} | Your Blog Name`,
      description: post.excerpt || 'Read this insightful blog post on our platform.',
      openGraph: {
        title: post.title,
        description: post.excerpt || 'Read this insightful blog post on our platform.',
        type: 'article',
        locale: 'en_US',
        siteName: 'Your Blog Name',
        url: `${baseUrl}/blog/${id}`,
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author || 'Your Blog Name'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || 'Read this insightful blog post on our platform.',
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}/blog/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Your Blog Name',
      description: 'Read this insightful blog post on our platform.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function BlogPostLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}