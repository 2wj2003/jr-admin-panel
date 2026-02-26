import { LineButton } from '@components/organisms/line-button';
import Image from 'next/image';
import { HiOutlineShieldCheck, HiOutlineThumbUp } from 'react-icons/hi';
import { Fragment } from 'react';
import { Instalment } from './instalment';

interface CtaBoxProps {
  originalPrice: number;
  discountPrice: number;

  instalment?: number;

  warrantyDuration?: number;
}

interface PriceProps {
  originalPrice: number;
  discountPrice: number;
}

export const Price: React.FC<PriceProps> = ({ originalPrice, discountPrice }) => (
  <div className="px-0 md:px-6 py-2 flex flex-col space-y-2 md:text-center">
    <div className="text-slate-900 font-medium text-2xl">
      <span className="text-base font-normal mr-2">ราคา</span>
      {new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(originalPrice - discountPrice)}
    </div>
    {!!discountPrice && (
      <div className="text-gray-secondary font-normal text-sm">
        <span className="line-through opacity-50">
          {new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(originalPrice)}
        </span>

        <span className="text-orange-500">
          <span> ประหยัด </span>
          {new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(discountPrice)}
        </span>
      </div>
    )}
  </div>
);

export const CtaBox: React.FunctionComponent<CtaBoxProps> = ({
  originalPrice,
  discountPrice,
  instalment,
  warrantyDuration
}) => {
  const showPrice = originalPrice - (discountPrice || 0) !== 0;
  return (
    <div className="overflow-hidden rounded-lg py-4 md:shadow-dark">
      {showPrice ? (
        <Price originalPrice={originalPrice} discountPrice={discountPrice} />
      ) : (
        <div className="px-6 py-2 flex flex-col space-y-2 text-center">
          <div className="text-slate-900 text-2xl font-medium">สนใจสินค้า</div>
          <div className="text-gray-secondary text-base">
            ติดต่อทีมขายได้เลย!
          </div>
        </div>
      )}
      <div className="px-6 py-2 space-y-4">
        <LineButton />
        <div className="grid grid-cols-2">
          {!!warrantyDuration && (
            <div className=" text-primary col-span-1">
              <HiOutlineShieldCheck className="inline mr-2" size="1.2rem" />
              <span className="font-medium text-sm">
                รับประกัน {warrantyDuration} ปี
              </span>
            </div>
          )}
          <div className="text-primary col-span-1">
            <HiOutlineThumbUp className="inline mr-2" size="1.2rem" />
            <span className="font-medium text-sm">ติดตั้งฟรี</span>
          </div>
        </div>
      </div>
      {!!instalment && (
        <Fragment>
          <hr className="w-full border-t border-gray-200 my-4" />
          <Instalment instalment={instalment} />
        </Fragment>
      )}
    </div>
  );
};
