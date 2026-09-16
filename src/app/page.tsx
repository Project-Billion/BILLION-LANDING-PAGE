import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Performance } from "@/components/sections/Performance";
import { Proof } from "@/components/sections/Proof";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";

/** Landing page, sections 01 to 06 in the pivot spec order; the footer (07) lives in the root layout. */
export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <Performance />
      <HowItWorks />
      <Proof />
      <CTA />
    </>
  );
}
