'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SiteHeader, SiteFooter } from '../components/site-chrome';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const db = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const services = [
  { id: 'website', label: 'Website / web application', low: 900, high: 2800 },
  { id: 'mobile', label: 'Mobile application', low: 2500, high: 8000 },
  { id: 'ai', label: 'AI assistant / automation', low: 1600, high: 6500 },
  { id: 'software', label: 'Custom business software', low: 2200, high: 9500 },
  { id: 'design', label: 'UI/UX design', low: 700, high: 2600 },
  { id: 'saas', label: 'SaaS product / platform', low: 5000, high: 16000 }
];
const complexity = {
  starter: { label: 'Starter', multiplier: 0.85 },
  standard: { label: 'Standard', multiplier: 1 },
  advanced: { label: 'Advanced', multiplier: 1.5 }
};
const integrations = {
  none: { label: 'No external integrations', multiplier: 1 },
  few: { label: '1–2 integrations', multiplier: 1.15 },
  several: { label: '3+ integrations', multiplier: 1.35 }
};
const money = value => '

export default function Estimator() {
  const [service, setService] = useState('website');
  const [level, setLevel] = useState('standard');
  const [integration, setIntegration] = useState('none');
  const [timeline, setTimeline] = useState('Flexible');
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const selected = services.find(item => item.id === service) || services[0];
  const estimate = useMemo(() => {
    const factor = complexity[level].multiplier * integrations[integration].multiplier;
    return { low: selected.low * factor, high: selected.high * factor };
  }, [selected, level, integration]);

  async function submit(event) {
    event.preventDefault();
    if (!db) {
      setStatus('The online enquiry service is not configured right now. Please email hello@nexorasolutions.com with your estimate details.');
      return;
    }
    setBusy(true);
    setStatus('');
    const note = [
      'Project estimate request',
      'Estimated range: ' + money(estimate.low) + ' – ' + money(estimate.high) + ' USD (indicative only)',
      'Complexity: ' + complexity[level].label,
      'Integrations: ' + integrations[integration].label,
      'Preferred timeline: ' + timeline,
      'Project details: ' + (details.trim() || 'Not provided')
    ].join('\n');
    const { error } = await db.rpc('submit_nexora_enquiry', {
      p_name: name.trim(),
      p_email: email.trim(),
      p_phone: phone.trim(),
      p_company: company.trim(),
      p_service: selected.label,
      p_budget: money(estimate.low) + ' – ' + money(estimate.high) + ' USD (estimate)',
      p_timeline: timeline,
      p_reference_url: '',
      p_feature_notes: note,
      p_message: 'I used the Nexora project estimator and would like to discuss this project. ' + (details.trim() || 'Please contact me to discuss the requirements.')
    });
    setBusy(false);
    if (error) {
      setStatus('We could not send your request. Please try again or email hello@nexorasolutions.com.');
      return;
    }
    setStatus('Your estimate request has been received. Our team will review the details and contact you.');
    setName(''); setEmail(''); setCompany(''); setPhone(''); setDetails('');
  }

  return <>
    <SiteHeader />
    <main className="estimator-page">
      <section className="page-hero estimator-hero">
        <div className="container">
          <div className="eyebrow">PLAN YOUR NEXT DIGITAL PRODUCT</div>
          <h1>Estimate your <span className="text-gradient">project.</span></h1>
          <p>Build a quick project brief and see an indicative budget range before speaking with our team.</p>
          <div className="page-hero-meta"><span>2-minute estimate</span><span>No obligation</span><span>Reviewed by a human</span></div>
        </div>
      </section>
      <section className="section">
        <div className="container estimator-layout">
          <form className="estimator-form" onSubmit={submit}>
            <div className="estimator-step"><span>01</span><div><h2>What are you building?</h2><p>Choose the service that best matches your idea.</p></div></div>
            <div className="estimate-options">
              {services.map(item => <button type="button" key={item.id} className={'estimate-option ' + (service === item.id ? 'selected' : '')} onClick={() => setService(item.id)}><span>{item.label}</span><b>{service === item.id ? '✓' : '+'}</b></button>)}
            </div>
            <div className="estimator-step"><span>02</span><div><h2>How complex is the scope?</h2><p>This helps us calculate a more useful starting range.</p></div></div>
            <div className="estimate-choice-row">
              {Object.entries(complexity).map(([id, item]) => <button type="button" key={id} className={'estimate-choice ' + (level === id ? 'selected' : '')} onClick={() => setLevel(id)}><b>{item.label}</b><small>{id === 'starter' ? 'Core features' : id === 'standard' ? 'Several workflows' : 'Advanced workflows'}</small></button>)}
            </div>
            <label className="estimate-label">External integrations
              <select value={integration} onChange={event => setIntegration(event.target.value)}>{Object.entries(integrations).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select>
            </label>
            <label className="estimate-label">Preferred timeline
              <select value={timeline} onChange={event => setTimeline(event.target.value)}><option>Flexible</option><option>Within 4 weeks</option><option>1–2 months</option><option>3–6 months</option><option>Planning for later</option></select>
            </label>
            <label className="estimate-label">A few details about your idea
              <textarea rows={4} maxLength={2500} value={details} onChange={event => setDetails(event.target.value)} placeholder="What should the product do? Any must-have features or examples?" />
            </label>
            <div className="estimator-step"><span>03</span><div><h2>Where should we send the follow-up?</h2><p>Share your details and we will review the estimate with you.</p></div></div>
            <div className="estimate-contact-grid">
              <label className="estimate-label">Your name *<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="Full name" /></label>
              <label className="estimate-label">Work email *<input required type="email" maxLength={180} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" /></label>
              <label className="estimate-label">Company<input maxLength={120} value={company} onChange={event => setCompany(event.target.value)} placeholder="Company name" /></label>
              <label className="estimate-label">Phone / WhatsApp<input maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} placeholder="Optional" /></label>
            </div>
            <button className="button form-submit" disabled={busy}>{busy ? 'Sending request…' : 'Send my project brief ↗'}</button>
            {status && <p className="form-feedback" role="status">{status}</p>}
            <p className="estimate-privacy">Your details are only used to respond to this project request.</p>
          </form>
          <aside className="estimate-summary">
            <div className="eyebrow">YOUR INDICATIVE RANGE</div>
            <h2>{money(estimate.low)} <span>–</span> {money(estimate.high)}</h2>
            <p>USD · Planning estimate only</p>
            <div className="estimate-summary-line"><span>Service</span><b>{selected.label}</b></div>
            <div className="estimate-summary-line"><span>Scope</span><b>{complexity[level].label}</b></div>
            <div className="estimate-summary-line"><span>Integrations</span><b>{integrations[integration].label}</b></div>
            <div className="estimate-summary-line"><span>Timeline</span><b>{timeline}</b></div>
            <div className="estimate-note"><b>Important</b><p>This is an indicative planning range, not a quote or commitment. Final pricing depends on a discovery discussion, confirmed requirements, integrations and delivery scope.</p></div>
            <Link className="button button-quiet estimate-meeting" href="/meeting">Prefer a call? Book a meeting ↗</Link>
          </aside>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
 + (Math.round(value / 50) * 50).toLocaleString();

export default function Estimator() {
  const [service, setService] = useState('website');
  const [level, setLevel] = useState('standard');
  const [integration, setIntegration] = useState('none');
  const [timeline, setTimeline] = useState('Flexible');
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const selected = services.find(item => item.id === service) || services[0];
  const estimate = useMemo(() => {
    const factor = complexity[level].multiplier * integrations[integration].multiplier;
    return { low: selected.low * factor, high: selected.high * factor };
  }, [selected, level, integration]);

  async function submit(event) {
    event.preventDefault();
    if (!db) {
      setStatus('The online enquiry service is not configured right now. Please email hello@nexorasolutions.com with your estimate details.');
      return;
    }
    setBusy(true);
    setStatus('');
    const note = [
      'Project estimate request',
      'Estimated range: ' + money(estimate.low) + ' – ' + money(estimate.high) + ' USD (indicative only)',
      'Complexity: ' + complexity[level].label,
      'Integrations: ' + integrations[integration].label,
      'Preferred timeline: ' + timeline,
      'Project details: ' + (details.trim() || 'Not provided')
    ].join('\n');
    const { error } = await db.rpc('submit_nexora_enquiry', {
      p_name: name.trim(),
      p_email: email.trim(),
      p_phone: phone.trim(),
      p_company: company.trim(),
      p_service: selected.label,
      p_budget: money(estimate.low) + ' – ' + money(estimate.high) + ' USD (estimate)',
      p_timeline: timeline,
      p_reference_url: '',
      p_feature_notes: note,
      p_message: 'I used the Nexora project estimator and would like to discuss this project. ' + (details.trim() || 'Please contact me to discuss the requirements.')
    });
    setBusy(false);
    if (error) {
      setStatus('We could not send your request. Please try again or email hello@nexorasolutions.com.');
      return;
    }
    setStatus('Your estimate request has been received. Our team will review the details and contact you.');
    setName(''); setEmail(''); setCompany(''); setPhone(''); setDetails('');
  }

  return <>
    <SiteHeader />
    <main className="estimator-page">
      <section className="page-hero estimator-hero">
        <div className="container">
          <div className="eyebrow">PLAN YOUR NEXT DIGITAL PRODUCT</div>
          <h1>Estimate your <span className="text-gradient">project.</span></h1>
          <p>Build a quick project brief and see an indicative budget range before speaking with our team.</p>
          <div className="page-hero-meta"><span>2-minute estimate</span><span>No obligation</span><span>Reviewed by a human</span></div>
        </div>
      </section>
      <section className="section">
        <div className="container estimator-layout">
          <form className="estimator-form" onSubmit={submit}>
            <div className="estimator-step"><span>01</span><div><h2>What are you building?</h2><p>Choose the service that best matches your idea.</p></div></div>
            <div className="estimate-options">
              {services.map(item => <button type="button" key={item.id} className={'estimate-option ' + (service === item.id ? 'selected' : '')} onClick={() => setService(item.id)}><span>{item.label}</span><b>{service === item.id ? '✓' : '+'}</b></button>)}
            </div>
            <div className="estimator-step"><span>02</span><div><h2>How complex is the scope?</h2><p>This helps us calculate a more useful starting range.</p></div></div>
            <div className="estimate-choice-row">
              {Object.entries(complexity).map(([id, item]) => <button type="button" key={id} className={'estimate-choice ' + (level === id ? 'selected' : '')} onClick={() => setLevel(id)}><b>{item.label}</b><small>{id === 'starter' ? 'Core features' : id === 'standard' ? 'Several workflows' : 'Advanced workflows'}</small></button>)}
            </div>
            <label className="estimate-label">External integrations
              <select value={integration} onChange={event => setIntegration(event.target.value)}>{Object.entries(integrations).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select>
            </label>
            <label className="estimate-label">Preferred timeline
              <select value={timeline} onChange={event => setTimeline(event.target.value)}><option>Flexible</option><option>Within 4 weeks</option><option>1–2 months</option><option>3–6 months</option><option>Planning for later</option></select>
            </label>
            <label className="estimate-label">A few details about your idea
              <textarea rows={4} maxLength={2500} value={details} onChange={event => setDetails(event.target.value)} placeholder="What should the product do? Any must-have features or examples?" />
            </label>
            <div className="estimator-step"><span>03</span><div><h2>Where should we send the follow-up?</h2><p>Share your details and we will review the estimate with you.</p></div></div>
            <div className="estimate-contact-grid">
              <label className="estimate-label">Your name *<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="Full name" /></label>
              <label className="estimate-label">Work email *<input required type="email" maxLength={180} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" /></label>
              <label className="estimate-label">Company<input maxLength={120} value={company} onChange={event => setCompany(event.target.value)} placeholder="Company name" /></label>
              <label className="estimate-label">Phone / WhatsApp<input maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} placeholder="Optional" /></label>
            </div>
            <button className="button form-submit" disabled={busy}>{busy ? 'Sending request…' : 'Send my project brief ↗'}</button>
            {status && <p className="form-feedback" role="status">{status}</p>}
            <p className="estimate-privacy">Your details are only used to respond to this project request.</p>
          </form>
          <aside className="estimate-summary">
            <div className="eyebrow">YOUR INDICATIVE RANGE</div>
            <h2>{money(estimate.low)} <span>–</span> {money(estimate.high)}</h2>
            <p>USD · Planning estimate only</p>
            <div className="estimate-summary-line"><span>Service</span><b>{selected.label}</b></div>
            <div className="estimate-summary-line"><span>Scope</span><b>{complexity[level].label}</b></div>
            <div className="estimate-summary-line"><span>Integrations</span><b>{integrations[integration].label}</b></div>
            <div className="estimate-summary-line"><span>Timeline</span><b>{timeline}</b></div>
            <div className="estimate-note"><b>Important</b><p>This is an indicative planning range, not a quote or commitment. Final pricing depends on a discovery discussion, confirmed requirements, integrations and delivery scope.</p></div>
            <Link className="button button-quiet estimate-meeting" href="/meeting">Prefer a call? Book a meeting ↗</Link>
          </aside>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
