import { Button } from '@/components/ui/button';
import { BrainCircuit, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyThisExistsSection } from '@/components/landing/WhyThisExistsSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { Navbar } from '@/components/landing/Navbar';

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <WhyThisExistsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <FooterSection />
  </div>
);

export default Index;
