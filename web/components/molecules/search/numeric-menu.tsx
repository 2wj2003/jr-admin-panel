import {
  useNumericMenu,
  UseNumericMenuProps
} from 'react-instantsearch-hooks-web';
import cx from 'classnames';
interface NumericMenuProps extends UseNumericMenuProps {}

export const NumericMenu: React.FC<NumericMenuProps> = ({
  attribute,
  items
}) => {
  const {
    items: menues,
    refine,
    hasNoResults
  } = useNumericMenu({
    attribute,
    items
  });

  return (
    <div
      className={cx(
        'ais-NumericMenu',
        hasNoResults && 'ais-NumericMenu--noRefinement'
      )}
    >
      <ul className="ais-NumericMenu-list flex flex-col space-y-2">
        {menues.map((item) => (
          <li
            key={item.value}
            className={cx(
              'ais-NumericMenu-item',
              item.isRefined && 'ais-NumericMenu-item--selected'
            )}
          >
            <label className="ais-NumericMenu-label flex flex-row items-center text-gray-secondary space-x-2 cursor-pointer w-full">
              <input
                className="ais-NumericMenu-radio w-4 h-4 text-blue-600 bg-white rounded-full border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="radio"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span className="ais-NumericMenu-labelText flex-1 whitespace-nowrap text-sm">
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
