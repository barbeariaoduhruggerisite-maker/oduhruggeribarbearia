import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import WhatsAppButton from "@/components/WhatsAppButton";

const Services = lazy(() => import("@/components/Services"));
const SocialProof = lazy(() => import("@/components/SocialProof"));
const Gallery = lazy(() => import("@/components/Gallery"));
const Hours = lazy(() => import("@/components/Hours"));
const Location = lazy(() => import("@/components/Location"));
const Scheduling = lazy(() => import("@/components/Scheduling"));
const CtaFinal = lazy(() => import("@/components/CtaFinal"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => (
  <>
    <Navbar />
    <Hero />
    <ValueProposition />
    <Suspense fallback={null}>
      <Services />
      <SocialProof />
      <Gallery />
      <Hours />
      <Location />
      <Scheduling />
      <CtaFinal />
      <Footer />
    </Suspense>
    <WhatsAppButton />
  </>
);

export default Index;
