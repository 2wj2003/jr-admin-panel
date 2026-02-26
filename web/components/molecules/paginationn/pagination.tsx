import React, { PropsWithChildren } from 'react';
import { BreakView } from './break-view';
import { CurSor } from './cursor';
import { PageView } from './page-view';

interface PaginationProps {
  currentPage: number;
  nbPages: number;
}

const pageRangeDisplayed = 2;
const marginPagesDisplayed = 2;

const PageViewGroup = ({ nbPages, currentPage }: PaginationProps) => {
  const items = [];

  if (nbPages <= pageRangeDisplayed) {
    for (let index = 1; index <= nbPages; index++) {
      items.push(
        <PageView isSelect={currentPage === index} page={index} key={index} />
      );
    }
  } else {
    let leftSide = pageRangeDisplayed / 2;
    let rightSide = pageRangeDisplayed - leftSide;

    // If the currentPage page index is on the default right side of the pagination,
    // we consider that the new right side is made up of it (= only one break element).
    // If the currentPage page index is on the default left side of the pagination,
    // we consider that the new left side is made up of it (= only one break element).
    if (currentPage > nbPages - pageRangeDisplayed / 2) {
      rightSide = nbPages - currentPage;
      leftSide = pageRangeDisplayed - rightSide;
    } else if (currentPage < pageRangeDisplayed / 2) {
      leftSide = currentPage;
      rightSide = pageRangeDisplayed - leftSide;
    }

    let index;
    let page;
    let breakView;

    for (index = 1; index <= nbPages; index++) {
      page = index + 1;

      // If the page index is lower than the margin defined,
      // the page has to be displayed on the left side of
      // the pagination.
      if (page <= marginPagesDisplayed) {
        items.push(
          <PageView isSelect={currentPage === index} page={index} key={index} />
        );
        continue;
      }

      // If the page index is greater than the page count
      // minus the margin defined, the page has to be
      // displayed on the right side of the pagination.
      if (page > nbPages) {
        items.push(
          <PageView isSelect={currentPage === index} page={index} key={index} />
        );
        continue;
      }

      // If the page index is near the currentPage page index
      // and inside the defined range (pageRangeDisplayed)
      // we have to display it (it will create the center
      // part of the pagination).
      if (index >= currentPage - leftSide && index <= currentPage + rightSide) {
        items.push(
          <PageView isSelect={currentPage === index} page={index} key={index} />
        );
        continue;
      }

      // If the page index doesn't meet any of the conditions above,
      // we check if the last item of the current "items" array
      // is a break element. If not, we add a break element, else,
      // we do nothing (because we don't want to display the page).
      if (items[items.length - 1] !== breakView) {
        breakView = <BreakView key={index} />;
        items.push(breakView);
      }
    }
  }

  return items;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  nbPages
}) => {
  if (nbPages <= 1) {
    return null;
  }

  return (
    <ul className="inline-flex items-center -space-x-px">
      <CurSor
        ariaDisable={currentPage === 1}
        rel="prev"
        page={currentPage === 1 ? 1 : currentPage - 1}
      />
      {PageViewGroup({ nbPages, currentPage })}
      <CurSor
        page={currentPage + 1}
        ariaDisable={nbPages < 3 || currentPage === nbPages}
        rel="next"
      />
    </ul>
  );
};
