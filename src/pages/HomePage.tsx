import { Contact } from '../sections/home/Contact';
import { Hero } from '../sections/home/Hero';
import { WorkPreview } from '../sections/home/WorkPreview';

export function HomePage() {
  return (
    <>
      <Hero />
      <WorkPreview />
      <Contact />
    </>
  );
}
