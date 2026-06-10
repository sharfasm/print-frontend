import { Metadata } from 'next';
import { generateLocationMetadata } from '@/lib/seo/metadata';
import LocationPage from '@/components/seo/LocationPage';

export const generateMetadata = (): Metadata => {
  return generateLocationMetadata('Calicut', 'calicut');
};

export default function CalicutPrintingPage() {
  return (
    <LocationPage
      city="Calicut"
      slug="calicut"
      pincode="673001"
      landmark="Kozhikode Beach & Cyberpark"
      localIntro="From Cyberpark IT firms to retailers on SM Street, Calicut requires high-quality commercial assets. Printvoz supports this historical hub."
      deliveryTimeline="2 to 4 business days"
    />
  );
}
