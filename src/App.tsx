import { Contact, Footer } from './components/Contact.tsx';
import { FloatingNav } from './components/FloatingNav.tsx';
import { Hero } from './components/Hero.tsx';
import { Projects } from './components/Projects.tsx';
import { Stack } from './components/Stack.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { Work } from './components/Work.tsx';

export function App() {
  return (
    <ToastProvider>
      <div className="backdrop" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <FloatingNav />
      <main id="main">
        <div id="top" tabIndex={-1} />
        <Hero />
        <Work />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </ToastProvider>
  );
}
