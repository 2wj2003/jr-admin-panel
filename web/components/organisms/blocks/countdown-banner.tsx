import Image from 'next/image';
import { ComponentSharedCountdownBanner } from '@lib/@generated/graphql';
import { useCountdown } from '@lib/hooks/countdown';
import cx from 'classnames';

interface CountdownBannerProps extends ComponentSharedCountdownBanner {}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  endDate,
  image,
  bgColor
}) => {
  const [days, hours, minutes, seconds] = useCountdown(endDate);

  return (
    <div
      className={cx('rounded-none md:rounded-lg px-4 md:px-8 py-2', {
        'bg-yellow-300': bgColor === 'yellow',
        'bg-primary-500': bgColor === 'primary'
      })}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-[120px] md:max-w-[180px]">
            <Image
              src={image.data?.attributes?.url || ''}
              width={image.data?.attributes?.width || 179}
              height={image.data?.attributes?.height || 60}
              layout="responsive"
              loading="lazy"
              objectFit="cover"
              // placeholder="blur"
              alt={image.data?.attributes?.alternativeText || 'flash-sale'}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="hidden md:flex flex-col">
            <div className="text-3xl font-bold text-slate-600">
              ราคาพิเศษ
            </div>
            <div>เหลือเวลาเพียง</div>
          </div>
          <div>
            <div className="flex justify-center items-center">
              <div className="mx-1">
                <div className="flex justify-center items-center w-[42px] h-[42px] md:w-[55px] md:h-[55px] bg-black rounded-xl">
                  <p className="text-lg md:text-3xl font-bold text-white">{days}</p>
                </div>
                <p className="my-0 md:my-1 text-sm text-center text-black">วัน</p>
              </div>
              <div className="mx-1">
                <div className="flex justify-center items-center w-[42px] h-[42px] md:w-[55px] md:h-[55px] bg-black rounded-xl">
                  <p className="text-lg md:text-3xl font-bold text-white">{hours}</p>
                </div>
                <p className="my-0 md:my-1 text-sm text-center text-black">ชั่วโมง</p>
              </div>
              <div className="mx-1">
                <div className="flex justify-center items-center w-[42px] h-[42px] md:w-[55px] md:h-[55px] bg-black rounded-xl">
                  <p className="text-lg md:text-3xl font-bold text-white">{minutes}</p>
                </div>
                <p className="my-0 md:my-1 text-sm text-center text-black">นาที</p>
              </div>
              <div className="mx-1">
                <div className="flex justify-center items-center w-[42px] h-[42px] md:w-[55px] md:h-[55px] bg-black rounded-xl">
                  <p className="text-lg md:text-3xl font-bold text-white">{seconds}</p>
                </div>
                <p className="my-0 md:my-1 text-sm text-center text-black">วินาที</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
