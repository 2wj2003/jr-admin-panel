import Image from 'next/image';

interface InstalmentProps {
  instalment: number;
}
export const Instalment: React.FC<InstalmentProps> = ({ instalment }) => {
  if (!instalment) {
    return null;
  }
  
  return (
    <div className="px-6 py-2 flex flex-col space-y-2">
      <div className="text-slate-600 text-sm">
        ** ผ่อนชำระ 0% สูงสุด {instalment} เดือน **
      </div>
      <div className="relative">
        <Image
          src="https://venuee-static.s3-ap-southeast-1.amazonaws.com/assets/instalment-bank.png"
          width={224}
          height={40}
          // layout="fixed"
          loading="lazy"
          className="mx-auto"
          // placeholder="blur"
          alt='ช่องทางการผ่อนชำระ 0%'
          title='ช่องทางการผ่อนชำระ 0%'
        />
      </div>
    </div>
  );
};
