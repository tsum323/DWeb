import { Approach } from '../sections/home/Approach';
import { Breakdown } from '../sections/home/Breakdown';
import { Contact } from '../sections/home/Contact';
import { Hero } from '../sections/home/Hero';
import { Services } from '../sections/home/Services';
import { Work } from '../sections/home/Work';

export function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Breakdown />
      <Services />
      <Approach />
      <Contact />
    </>
  );
}
