import { Achievements } from './components/Achievements.tsx';
import { Contact, Footer } from './components/Contact.tsx';
import { Experience } from './components/Experience.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ImpactBar } from './components/ImpactBar.tsx';
import { Projects } from './components/Projects.tsx';
import { Skills } from './components/Skills.tsx';
import { ToastProvider } from './components/Toast.tsx';

export function App() {
  return (
    <ToastProvider>
      <div className="aurora" aria-hidden="true">
        <span className="aurora-a" />
        <span className="aurora-b" />
        <span className="aurora-c" />
      </div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <div id="top" tabIndex={-1} />
        <Hero />
        <ImpactBar />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
