import { posts } from './content';
const base='https://nexora-solutions-nexora-solutions6.vercel.app';
const updated=new Date('2026-11-13T00:00:00.000Z');
export default function sitemap(){return [{url:base,lastModified:updated,changeFrequency:'monthly',priority:1},{url:base+'/projects',lastModified:updated,changeFrequency:'monthly',priority:0.8},{url:base+'/blog',lastModified:updated,changeFrequency:'weekly',priority:0.8},...posts.map(post=>({url:base+'/blog/'+post.slug,lastModified:updated,changeFrequency:'monthly',priority:0.7}))];}