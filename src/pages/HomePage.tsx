import { Approach } from '../sections/home/Approach';
import { Contact } from '../sections/home/Contact';
import { Hero } from '../sections/home/Hero';
import { Services } from '../sections/home/Services';
import { Work } from '../sections/home/Work';

export function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <Approach />
      <Contact />
    </>
  );
}
