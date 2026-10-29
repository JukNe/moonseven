import Navbar from './components/Navbar';
import HeroSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import ToolsSection from './components/ToolsSection';
import ContactSection from './components/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black scroll-smooth">
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ToolsSection />
        <ContactSection />
      </main>
    </div>
  );
}
