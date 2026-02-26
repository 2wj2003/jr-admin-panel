import Image from 'next/image';
import { LineButton } from './line-button';

export const Slogan = () => (
  <div className="container mx-auto px-0 md:px-8 lg:px-10 my-0 md:my-4">
    <div className="bg-slate-100 w-full rounded-lg">
      <div className="grid grid-cols-12 px-4 md:px-8 py-8">
        <div className="col-span-12 md:col-span-5 text-center space-y-4 my-auto">
          <div className="text-xl md:text-2xl text-primary-600 font-bold text-center max-w-lg mx-auto">
            <div>การันตีคุณภาพ ประสบการณ์ 35 ปี</div>
            <div>ติดตั้งมาแล้วกว่า 1 แสน ครัวเรือนทั่วไทย</div>
          </div>
          <p className="text-slate-600 text-base">
            ยินดีให้คำปรึกษา โดยทีมงานมือชีพ
          </p>
          <div className="mx-auto max-w-sm">
            <LineButton title="ปรึกษาผู้เชี่ยวชาญ ฟรี!" />
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 relative px-0 md:px-8 py-0 md:py-8 mt-8 md:mt-0">
          <Image
            width="191"
            height="100"
            src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/Banner_1c605e2bb9.jpg"
            loading="lazy"
            layout="responsive"
            objectFit="cover"
            // placeholder="blur"
            className="overflow-hidden rounded-lg"
            sizes="(max-width: 360px) 480px, 960px"
            alt="เจ.อาร์ ออฟฟิต ออโตเมชั่น การันตีคุณภาพกว่า 35 ปี"
            title="เจ.อาร์ ออฟฟิต ออโตเมชั่น การันตีคุณภาพกว่า 35 ปี"
          />
        </div>
      </div>
    </div>
  </div>
);
