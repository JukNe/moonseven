import RevealOnScroll from "./RevealOnScroll";
import Section from "./Section";

export default function HeroSection() {
  return (
    <Section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.02] object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </Section>
  );
}
