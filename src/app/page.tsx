import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ProductMockups from '@/components/ProductMockups';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kōdo POS",
    "operatingSystem": "Mac, Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "29.00",
      "priceCurrency": "EUR"
    },
    "description": "Le système d'exploitation de votre commerce. POS moderne, réservations intelligentes et présence digitale propulsés par l'IA.",
    "url": "https://kōdo-solutions.com",
    "publisher": {
      "@type": "Organization",
      "name": "Kōdo Solutions",
      "url": "https://kōdo-solutions.com"
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      <ProductMockups />
      <Testimonials />
      <Pricing />
      <ContactForm />
      
      <footer className="bg-foreground text-background py-8 text-center">
        <p className="text-sm font-medium opacity-80">
          &copy; {new Date().getFullYear()} Kōdo Solutions. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
