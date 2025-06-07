import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-12">
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-blue-600 hover:underline">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-blue-600 hover:underline">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <section className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Blog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover insightful articles, tutorials, and stories that will help you
          learn and grow.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Latest Posts</h2>
            <p className="text-gray-600 mb-4">Check out our most recent articles...</p>
            <Link href="/blog" className="text-blue-600 hover:underline">
              View all posts →
            </Link>
          </article>
          
          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">About Us</h2>
            <p className="text-gray-600 mb-4">Learn more about our mission and team...</p>
            <Link href="/about" className="text-blue-600 hover:underline">
              Read more →
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
