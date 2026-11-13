import HomeClient from './home-client';
export const metadata = {
  title: 'Web Development, Mobile Apps & AI Solutions',
  description: 'Build your next digital product with Nexora Solutions. We create modern websites, Flutter apps, AI workflows and custom business software.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Nexora Solutions — Build what is next', description: 'Websites, apps, AI and custom software for ambitious businesses.' }
};
const organization = { '@context':'https://schema.org', '@type':'Organization', name:'Nexora Solutions', url:'https://nexora-solutions-nexora-solutions6.vercel.app', description:'Web, mobile, AI and custom software development agency.' };
export default function HomePage() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><HomeClient /></>; }