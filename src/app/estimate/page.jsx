import Estimator from './estimator';

export const metadata = {
  title: 'Project Cost Estimator',
  description: 'Get an indicative project budget for your website, mobile app, AI solution or custom software project.',
  alternates: { canonical: '/estimate' },
  robots: { index: true, follow: true }
};

export default function EstimatePage() {
  return <Estimator />;
}
