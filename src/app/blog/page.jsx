import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../components/site-chrome';
import { posts } from '../content';

export const metadata = {
  title: 'Insights on Web, Mobile, AI & Software',
  description: 'Practical guides from Nexora Solutions on web development, mobile apps, AI automation, product design and business software.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Nexora Solutions Insights', description: 'Practical ideas for building better digital products.' }
};

function imageUrl(id) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;
}

export default function BlogPage() {
  return <>
    <SiteHeader />
    <main className="inner-page">
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">NEXORA INSIGHTS</div>
          <h1>Clear thinking for <span className="text-gradient">better products.</span></h1>
          <p>Practical perspectives on software, product design, AI and the decisions behind useful digital experiences.</p>
          <div className="page-hero-meta"><span>{posts.length} practical guides</span><span>Ideas · Engineering · Design</span></div>
        </div>
      </section>
      <section className="section">
        <div className="container blog-grid">
          {posts.map((post, i) => <article className="blog-card" key={post.slug}>
            <Link className="blog-image-wrap" href={'/blog/' + post.slug} aria-label={'Read ' + post.title}>
              <img src={imageUrl(post.image)} alt={post.imageAlt} loading={i < 3 ? 'eager' : 'lazy'} />
              <span className="blog-image-category">{post.category}</span>
            </Link>
            <div className="blog-card-body">
              <div className="blog-meta"><span>{post.category}</span><span>{post.readTime}</span></div>
              <h2><Link href={'/blog/' + post.slug}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className="text-link" href={'/blog/' + post.slug}>Read article <span>↗</span></Link>
            </div>
          </article>)}
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}