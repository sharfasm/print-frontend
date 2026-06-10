import { Metadata } from 'next';
import { generateLocationMetadata } from '@/lib/seo/metadata';
import LocationPage from '@/components/seo/LocationPage';

export const generateMetadata = (): Metadata => {
  return generateLocationMetadata('Trivandrum', 'trivandrum');
};

export default function TrivandrumPrintingPage() {
  return (
    <LocationPage
      city="Trivandrum"
      slug="trivandrum"
      pincode="695001"
      landmark="Technopark & Padmanabhaswamy Temple"
      localIntro="Catering to administrative setups, IT corporations at Technopark, and universities in Trivandrum, Printvoz delivers standard corporate printing solutions."
      deliveryTimeline="2 to 3 business days"
    />
  );
}
