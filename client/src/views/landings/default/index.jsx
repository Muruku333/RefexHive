'use client';

// @project
// import { Feature20 } from '@/blocks/feature';
import { Hero17 } from '@/blocks/hero';
import LazySection from '@/components/LazySection';
import useDataThemeMode from '@/hooks/useDataThemeMode';

// @data
import {
  benefit,
  clientele,
  cta4,
  cta5,
  faq,
  feature20,
  feature21,
  feature18,
  slide,
  hero,
  integration,
  other,
  pricing,
  testimonial,
  chairman,
  leadership
} from './data';
import { Carousel } from '@/blocks/life-at-refex';

/***************************  PAGE - MAIN  ***************************/

export default function Main() {
  useDataThemeMode();

  return (
    <>
      <Hero17 {...hero} />
      <Carousel {...slide} />
      {/* <Feature20 {...feature20} /> */}

      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/chairman').then((module) => ({ default: module.Corner })), props: chairman },
          { importFunc: () => import('@/blocks/chairman').then((module) => ({ default: module.Leadership })), props: leadership }
        ]}
        offset="200px"
      />

      {/* <LazySection
        sections={[
          { importFunc: () => import('@/blocks/feature').then((module) => ({ default: module.Feature18 })), props: feature18 },
          { importFunc: () => import('@/blocks/feature').then((module) => ({ default: module.Feature21 })), props: feature21 },
          { importFunc: () => import('@/blocks/cta').then((module) => ({ default: module.Cta4 })), props: cta4 }
        ]}
        offset="200px"
      />

      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/testimonial').then((module) => ({ default: module.Testimonial10 })), props: testimonial },
          { importFunc: () => import('@/blocks/clientele').then((module) => ({ default: module.Clientele3 })), props: clientele },
          { importFunc: () => import('@/blocks/pricing').then((module) => ({ default: module.Pricing9 })), props: pricing }
        ]}
        offset="200px"
      />

      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/cta').then((module) => ({ default: module.Cta5 })), props: cta5 },
          { importFunc: () => import('@/blocks/faq').then((module) => ({ default: module.Faq6 })), props: faq }
        ]}
        offset="200px"
      /> */}
    </>
  );
}
