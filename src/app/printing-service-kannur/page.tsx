import { Metadata } from 'next';
import { generateLocationMetadata } from '@/lib/seo/metadata';
import LocationPage from '@/components/seo/LocationPage';

export const generateMetadata = (): Metadata => {
  return generateLocationMetadata('Kannur', 'kannur');
};

export default function KannurPrintingPage() {
  return (
    <LocationPage
      city="Kannur"
      slug="kannur"
      pincode="670001"
      landmark="Payyambalam Beach & Kannur International Airport"
      localIntro="With the expanding airport corridor and rich handloom legacy, Kannur's trade relies heavily on clean product packaging and banner marketing."
      deliveryTimeline="3 to 4 business days"
    />
  );
}
