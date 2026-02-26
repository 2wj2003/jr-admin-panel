import { useForm } from 'react-hook-form';
import cx from 'classnames';
import { ComponentSharedHeroForm } from '@lib/@generated/graphql';
import { getApiUrl } from '@lib/api/get-url';
import { ezforms } from '@lib/api/form';
import { lineNotify } from '@lib/api/line';

interface FormProps {
  title: string;
  background: ComponentSharedHeroForm['background'];
}

interface IFieldValues {
  name: string;
  tel: string;

  consent: boolean;
}

export const Form: React.FC<FormProps> = ({ title, background }) => {
  const { register, handleSubmit } = useForm<IFieldValues>();

  const onSubmit = (data: IFieldValues) => {
    ezforms(data).then(() => lineNotify(data.name, data.tel));
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-normal bg-white">
      <h2 className="text-2xl font-medium text-slate-600 mb-4">{title}</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="felx flex-col space-y-4"
      >
        <input
          id="name"
          type="text"
          placeholder="ชื่อ"
          {...register('name', { required: true })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          id="tel"
          type="tel"
          placeholder="เบอร์โทร"
          {...register('tel', {
            required: true,
            minLength: 6,
            maxLength: 12
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="flex items-start mb-6">
          <label
            htmlFor="remember"
            className="text-[10px] text-gray-secondary font-normal"
          >
            <input
              id="remember"
              type="checkbox"
              value=""
              className="mr-2 w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              {...register('consent', {
                required: true,
                minLength: 6,
                maxLength: 12
              })}
            />
            ท่านได้อ่าน เข้าใจ และให้ความยินยอม สำหรับการเก็บรวบรวม จัดเก็บ ใช้
            เก็บรักษา ประมวลผล เปิดเผย และโอนข้อมูลส่วนบุคคลของท่าน
            เพื่อวัตถุประสงค์ตามที่ระบุไว้ใน{' '}
            <a href="#" className="hover:text-primary underline">
              ถ้อยแถลงเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคลถ้อยแถลง
            </a>
          </label>
        </div>
        <button
          type="submit"
          className={cx('text-white w-full text-center py-2 rounded', {
            'bg-red-600': background === 'primary',
            'bg-primary': background === 'white'
          })}
        >
          คลิก! ให้เราโทรกลับ
        </button>
      </form>
    </div>
  );
};
