import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader, SiteFooter } from '../../components/site-chrome';
import { posts } from '../../content';

export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find(item => item.slug === slug);
  if (!post) return { title: 'Article not found' };
  const image = `https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1200&q=82`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: '/blog/' + post.slug },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, images: [{ url: image, alt: post.imageAlt }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [image] }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = posts.find(item => item.slug === slug);
  if (!post) notFound();
  const image = `https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1600&q=85`;
  return <>
    <SiteHeader />
    <main className="article-page">
      <div className="container article-container">
        <Link className="back-link" href="/blog">← Back to insights</Link>
        <div className="eyebrow">{post.category.toUpperCase()} · {post.readTime.toUpperCase()}</div>
        <h1>{post.title}</h1>
        <p className="article-intro">{post.intro}</p>
        <figure className="article-cover">
          <img src={image} alt={post.imageAlt} />
          <figcaption>Visual context for this article · Nexora Insights</figcaption>
        </figure>
        <div className="article-body">
          {post.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
        </div>
        <div className="article-cta"><h2>Planning something similar?</h2><p>Talk with Nexora about the product or workflow you want to improve.</p><Link className="button" href="/#contact">Discuss your project ↗</Link></div>
      </div>
    </main>
    <SiteFooter />
  </>;
}