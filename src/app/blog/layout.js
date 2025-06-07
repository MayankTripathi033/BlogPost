import { headers } from 'next/headers';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return {
    title: 'Blog Posts | Your Blog Name',
    description: 'Explore our collection of insightful blog posts covering various topics. Read the latest articles and stay updated with our content.',
    openGraph: {
      title: 'Blog Posts | Your Blog Name',
      description: 'Explore our collection of insightful blog posts covering various topics. Read the latest articles and stay updated with our content.',
      type: 'website',
      locale: 'en_US',
      siteName: 'Your Blog Name',
      url: `${baseUrl}/blog`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog Posts | Your Blog Name',
      description: 'Explore our collection of insightful blog posts covering various topics. Read the latest articles and stay updated with our content.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
  };
}

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 