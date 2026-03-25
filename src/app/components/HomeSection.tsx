import HeroBackgroundVideo from "./HeroBackgroundVideo";
import Section from "./Section";

export default function HeroSection() {
  return (
    <Section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <HeroBackgroundVideo />
    </Section>
  );
}