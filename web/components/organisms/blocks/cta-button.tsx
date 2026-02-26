import { ComponentSharedButton } from '@lib/@generated/graphql';
import Link from 'next/link';
import cx from 'classnames';

interface CTAButtonProps extends ComponentSharedButton {
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  link,
  tagId,
  target,
  title,
  id,
  outline,
  color,
  className
}) => {
  return (
    (<Link
      href={link || '#'}
      id={tagId || id}
      target={target || '_blank'}
      className={cx(
        'py-3 px-6 text-center flex justify-center text-primary-500 border border-primary-500 hover:text-white hover:bg-primary',
        // {
        //   'bg-primary text-white hover:bg-primary-600':
        //     color === 'primary' && !outline,
        //   'bg-white text-primary border border-primary hover:bg-primary hover:bg-opacity-10':
        //     color === 'primary' && outline,
        //   'bg-red-600 text-white hover:bg-red-700':
        //     color === 'red' && !outline,
        //   'bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:bg-opacity-10':
        //     color === 'red' && outline,
        //   'bg-yellow-300 text-white hover:bg-yellow-400':
        //     color === 'yellow' && !outline,
        //   'bg-white text-yellow-400 border border-yellow-300 hover:bg-yellow-400 hover:bg-opacity-10':
        //     color === 'yellow' && outline,
        //   'bg-line text-white hover:bg-line': color === 'line' && !outline,
        //   'bg-white text-line border border-line hover:bg-line hover:bg-opacity-10':
        //     color === 'line' && outline,
        //     'bg-white text-slate-600 border border-gray-400 hover:bg-gray-50':
        //       color === 'gray' && outline
        // },
        className
      )}>

      {title}

    </Link>)
  );
};
