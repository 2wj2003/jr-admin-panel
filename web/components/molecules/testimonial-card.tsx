import { ComponentSharedTestimonial } from '@lib/@generated/graphql';
import { FaQuoteLeft } from 'react-icons/fa';

export interface TestimonialCardProps extends ComponentSharedTestimonial {}
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  title,
  subTitle,
  description,
  rating,
  image
}) => {
  return (
    <div className="bg-whtie rounded-lg p-6 border border-gray-200 bg-white">
      <FaQuoteLeft className='text-primary'/>
      <div className="text-base text-gray-secondary font-normal mb-4">
        {description}
      </div>
      <div className="flex items-center space-x-4">
        <div className="space-y-1 font-medium dark:text-white">
          <div>{title}</div>
          <div className="text-sm text-gray-secondary font-normal">
            {subTitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
