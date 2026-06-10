import { Metadata } from 'next';
import { generateLocationMetadata } from '@/lib/seo/metadata';
import LocationPage from '@/components/seo/LocationPage';

export const generateMetadata = (): Metadata => {
  return generateLocationMetadata('Thrissur', 'thrissur');
};

export default function ThrissurPrintingPage() {
  return (
    <LocationPage
      city="Thrissur"
      slug="thrissur"
      pincode="680001"
      landmark="Swaraj Round & Vadakkunnathan Temple"
      localIntro="As the cultural capital of Kerala, Thrissur hosts vibrant festivals and expanding business houses. From Swaraj Round to surrounding corporate blocks, we offer personalized services."
      deliveryTimeline="2 to 3 business days"
    />
  );
}
