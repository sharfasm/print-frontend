import { Metadata } from 'next';
import { generateLocationMetadata } from '@/lib/seo/metadata';
import LocationPage from '@/components/seo/LocationPage';

export const generateMetadata = (): Metadata => {
  return generateLocationMetadata('Kochi', 'kochi');
};

export default function KochiPrintingPage() {
  return (
    <LocationPage
      city="Kochi"
      slug="kochi"
      pincode="682001"
      landmark="Marine Drive & Lulu Mall"
      localIntro="Whether you are a startup in Infopark, a retailer at Lulu Mall, or an event organizer in Fort Kochi, we provide local support."
      deliveryTimeline="1 to 2 business days"
    />
  );
}
