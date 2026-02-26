import Image from 'next/image';
import { ComponentSharedTimeline } from '@lib/@generated/graphql';
import { SiLine } from 'react-icons/si';
import { LineButton } from '../line-button';

interface TimeLineItemProps {
  no: number;
  title: string;

  description: string;
}

const TimelineItem: React.FC<TimeLineItemProps> = ({
  no,
  title,
  description
}) => {
  return (
    <li className="mb-10 ml-6">
      <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <div className="text-blue-600 dark:text-blue-400">{no}</div>
      </span>
      <h3 className="flex items-center mb-1 text-lg font-medium text-slate-600">
        {title}
      </h3>
      <div className="w-full max-w-lg text-gray-secondary whitespace-pre-wrap font-body prose prose-lg prose-p:m-0">
            <div
              dangerouslySetInnerHTML={{
                __html: description || ''
              }}
            />
          </div>
    </li>
  );
};

export interface TimelineProps extends ComponentSharedTimeline {}

export const Timeline: React.FC<TimelineProps> = ({
  title,
  description,
  items,
  image
}) => {
  return (
    <section>
      <div className="flex w-full mt-4 md:mt-8 justify-center">
        <div className="flex flex-col md:px-0">
          <h2 className="text-slate-600 font-medium text-xl md:text-2xl my-auto font-sans mb-1 text-center">
            {title}
          </h2>

          <div className="w-full max-w-lg text-gray-secondary whitespace-pre-wrap font-body prose prose-lg prose-p:m-0 text-center">
            <div
              dangerouslySetInnerHTML={{
                __html: description || ''
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 py-8 md:py-16">
        <div className="w-full md:w-1/2 mb-6">
          <Image
            src={image?.data?.attributes?.url || ''}
            width={image?.data?.attributes?.width || 160}
            height={image?.data?.attributes?.height || 90}
            // layout="responsive"
            loading="lazy"
            // placeholder="blur"
            alt={image?.data?.attributes?.alternativeText || ''}
          />
        </div>
        <div className="w-full md:w-1/2 pl-8">
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {items?.map((i, idx) => (
              <TimelineItem
                no={idx + 1}
                title={i?.title || ''}
                description={i?.description || ''}
                key={i?.id}
              />
            ))}
          </ol>
          <div className="py-4">
            {/* <a
              href="/"
              target="_blank"
              id="cta-line-btn"
              className="inline-block text-center text-base font-medium rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 transition duration-300 ease-in-out bg-line text-white hover:bg-opacity-90 ring-line w-full md:w-1/2 py-4 px-4 -ml-4"
            >
              <SiLine className="inline-block mr-2" size="1.5rem" />
              <p className="inline-block my-auto">
                เริ่มต้น ปรึกษาผู้เชี่ยวชาญ
              </p>
            </a> */}
            <LineButton title='เริ่มต้น ปรึกษาผู้เชี่ยวชาญ'
            
            className="max-w-full md:max-w-xs -ml-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


export default Timeline