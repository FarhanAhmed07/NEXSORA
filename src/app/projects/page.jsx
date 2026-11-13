import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../components/site-chrome';

export const metadata = {
  title: 'Product Concepts & Portfolio',
  description: 'Explore visual product concepts from Nexora Solutions across retail software, ecommerce, AI, healthcare, education and business automation.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Nexora Solutions — Product Concepts',
    description: 'Explore visual directions for digital products, software and business systems.',
    images: [{ url: '/og-projects.jpg', width: 1200, height: 630, alt: 'Nexora Solutions product concepts' }]
  }
};

const projects = [
  { name: 'RetailFlow Inventory & POS', category: 'Retail technology', desc: 'GRN receiving, supplier records, stock ledger, low-stock alerts and operational reports.', tags: 'Inventory · POS · Analytics', image: 'photo-1551288049-bebda4e38f71', alt: 'Business analytics dashboard on a computer screen', video: 'https://www.pexels.com/video/engaging-data-visualization-with-laptop-in-office-38685310/' },
  { name: 'Nexora Commerce', category: 'E-commerce', desc: 'A modern storefront with product discovery, variants, search, cart and checkout-ready flows.', tags: 'Next.js · Commerce · UX', image: 'photo-1556742049-0cfed4f6a45d', alt: 'Online payment and ecommerce checkout on a laptop' },
  { name: 'AI Support Assistant', category: 'Artificial intelligence', desc: 'A support assistant concept for FAQs, lead qualification, request routing and human handoff.', tags: 'AI · Automation · APIs', image: 'photo-1677442136019-21780ecad995', alt: 'Abstract artificial intelligence network visualization', video: 'https://www.pexels.com/video/software-developer-18382358/' },
  { name: 'ClinicConnect', category: 'Healthcare software', desc: 'Appointment discovery, patient intake, provider schedules and clinic operations.', tags: 'Web app · Scheduling', image: 'photo-1576091160399-112ba8d25d1d', alt: 'Healthcare professional reviewing digital patient information' },
  { name: 'LearnSphere LMS', category: 'Education technology', desc: 'Course catalogue, lesson progress, quizzes and instructor tools.', tags: 'LMS · Dashboards', image: 'photo-1509062522246-3755977927d7', alt: 'Students learning in a modern classroom' },
  { name: 'FleetPilot', category: 'Logistics', desc: 'Fleet overview, trip allocation, driver status and delivery visibility.', tags: 'Operations · Tracking', image: 'photo-1519003722824-194d4455a60c', alt: 'Delivery truck on a road' },
  { name: 'FinSight Analytics', category: 'Business intelligence', desc: 'A clear finance workspace for budgets, spending categories and reporting.', tags: 'Analytics · Reporting', image: 'photo-1460925895917-afdab827c52f', alt: 'Financial analytics and reporting dashboard', video: 'https://www.pexels.com/video/women-analyzing-data-on-laptop-in-office-38685311/' },
  { name: 'TaskFlow Workspace', category: 'Productivity', desc: 'Team boards, tasks, due dates, comments and project reporting.', tags: 'Collaboration · SaaS', image: 'photo-1521737711867-e3b97375f902', alt: 'Team collaborating around a laptop', video: 'https://www.pexels.com/video/men-using-digital-devices-in-an-office-7989677/' },
  { name: 'PropertyHub', category: 'Real estate', desc: 'Property discovery, saved listings, agent enquiries and responsive browsing.', tags: 'Marketplace · Search', image: 'photo-1486406146926-c627a92ad1ab', alt: 'Modern commercial buildings and architecture' },
  { name: 'FoodDash Ordering', category: 'Food & beverage', desc: 'Menu discovery, ordering flows, order status and merchant tools.', tags: 'Ordering · Commerce', image: 'photo-1555939594-58d7cb561ad1', alt: 'Fresh food prepared for online restaurant ordering' },
  { name: 'HR Orbit', category: 'Human resources', desc: 'Employee directory, leave requests, attendance and HR reporting.', tags: 'HR · Workflow', image: 'photo-1522071820081-009f0129c71c', alt: 'Colleagues collaborating in a workplace' },
  { name: 'SecureDocs', category: 'Document management', desc: 'A role-aware workspace for document review, status tracking and secure sharing.', tags: 'Documents · Access', image: 'photo-1450101499163-c8848c66ca85', alt: 'Business documents and paperwork on a desk' }
];

function imageUrl(id) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;
}

export default function ProjectsPage() {
  return <>
    <SiteHeader />
    <main className="inner-page">
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">SELECTED CAPABILITIES</div>
          <h1>Ideas shaped into <span className="text-gradient">digital experiences.</span></h1>
          <p>Explore visual directions for the kinds of products Nexora can design and build. These are illustrative concepts, not a list of completed client deployments.</p>
          <div className="page-hero-meta"><span>12 product concepts</span><span>Web · Mobile · AI · Software</span><span>Visual previews</span></div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="project-intro-row">
            <div><div className="eyebrow">EXPLORE THE CONCEPTS</div><h2 className="media-section-title">A closer look at what we can create.</h2></div>
            <p>Each preview pairs a product idea with relevant visual inspiration. Video links open external reference footage; they are not recordings of a finished Nexora product.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, i) => <article className="project-card project-card-media" key={project.name}>
              <div className="project-image-wrap">
                <img src={imageUrl(project.image)} alt={project.alt} loading={i < 3 ? 'eager' : 'lazy'} />
                <span className="project-image-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-image-label">CONCEPT PREVIEW</span>
              </div>
              <div className="project-card-body">
                <div className="project-meta"><span>{project.category}</span><span>CONCEPT</span></div>
                <h2>{project.name}</h2>
                <p>{project.desc}</p>
                <div className="tag-list">{project.tags.split(' · ').map(tag => <span key={tag}>{tag}</span>)}</div>
                {project.video && <a className="project-video-link" href={project.video} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> Watch visual reference <span aria-hidden="true">↗</span></a>}
              </div>
            </article>)}
          </div>
          <p className="visual-disclaimer">Photography is used for visual context only. Product interfaces shown here are concept directions, not screenshots of live client systems.</p>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container cta-band">
          <div><div className="eyebrow">HAVE A DIFFERENT IDEA?</div><h2>Let’s design the right solution.</h2><p>Tell us what your business needs and we can map out a practical approach.</p></div>
          <Link className="button" href="/#contact">Start a conversation ↗</Link>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}