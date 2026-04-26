import type { ComponentType } from "react";
import ReactPaginateModule, { type ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

const ReactPaginate =
  (
    ReactPaginateModule as unknown as {
      default?: ComponentType<ReactPaginateProps>;
    }
  ).default ??
  (ReactPaginateModule as unknown as ComponentType<ReactPaginateProps>);

export interface PaginationProps {
  pageCount: ReactPaginateProps["pageCount"];
  onPageChange: NonNullable<ReactPaginateProps["onPageChange"]>;
  forcePage?: ReactPaginateProps["forcePage"];
}

const Pagination = ({
  pageCount,
  onPageChange,
  forcePage,
}: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      forcePage={forcePage}
    />
  );
};

export default Pagination;
