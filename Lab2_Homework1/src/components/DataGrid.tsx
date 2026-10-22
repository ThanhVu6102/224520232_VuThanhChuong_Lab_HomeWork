import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import './DataGrid.css';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
}

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelect?: (item: T) => void;
  ariaLabel: string;
}

type SortDirection = 'asc' | 'desc';

interface SortState<T> {
  key: keyof T;
  direction: SortDirection;
}

interface FocusedCell {
  row: number;
  col: number;
}

type SelectionMode = 'select' | 'toggle';

const PAGE_SIZE = 5;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function DataGrid<T extends { id: number | string }>({
  data,
  columns,
  onRowSelect,
  ariaLabel,
}: DataGridProps<T>) {
  const [filterText, setFilterText] = useState('');
  const [sort, setSort] = useState<SortState<T> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedCell, setFocusedCell] = useState<FocusedCell>({ row: 0, col: 0 });
  const [selectedRowId, setSelectedRowId] = useState<T['id'] | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const tableRef = useRef<HTMLTableElement>(null);
  const instructionsId = useId();
  const filterId = useId();

  const debouncedFilter = useDebouncedValue(filterText, 250);
  const normalizedFilter = debouncedFilter.trim().toLowerCase();

  const filteredData = useMemo(() => {
    const matchingRows = normalizedFilter
      ? data.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(normalizedFilter),
          ),
        )
      : data;

    if (!sort) return matchingRows;

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });

    return [...matchingRows].sort((leftRow, rightRow) => {
      const leftValue = leftRow[sort.key];
      const rightValue = rightRow[sort.key];

      if (leftValue === null || leftValue === undefined) {
        return rightValue === null || rightValue === undefined ? 0 : 1;
      }
      if (rightValue === null || rightValue === undefined) return -1;

      const comparison =
        typeof leftValue === 'number' && typeof rightValue === 'number'
          ? leftValue - rightValue
          : collator.compare(String(leftValue), String(rightValue));

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, normalizedFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageRows = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const resultSummary =
    filteredData.length === 0
      ? 'No records found.'
      : `Showing ${startIndex + 1}–${startIndex + pageRows.length} of ${filteredData.length} records.`;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setFocusedCell({ row: 0, col: 0 });
  }, [safePage, normalizedFilter]);

  useEffect(() => {
    setFocusedCell((current) => {
      const row = Math.min(current.row, Math.max(0, pageRows.length - 1));
      const col = Math.min(current.col, Math.max(0, columns.length - 1));
      return row === current.row && col === current.col
        ? current
        : { row, col };
    });
  }, [pageRows.length, columns.length]);

  const focusCell = (row: number, col: number) => {
    if (pageRows.length === 0 || columns.length === 0) return;

    const nextRow = Math.min(Math.max(row, 0), pageRows.length - 1);
    const nextCol = Math.min(Math.max(col, 0), columns.length - 1);

    setFocusedCell({ row: nextRow, col: nextCol });

    const selector = `[data-cell="${nextRow}-${nextCol}"]`;
    const nextCell =
      tableRef.current?.querySelector<HTMLElement>(selector) ??
      document.querySelector<HTMLElement>(selector);

    nextCell?.focus();
  };

  const activateRow = (row: T, mode: SelectionMode) => {
    const rowLabel = columns
      .map((column) => String(row[column.accessorKey]))
      .join(', ');
    const isAlreadySelected = selectedRowId === row.id;

    if (mode === 'toggle' && isAlreadySelected) {
      setSelectedRowId(null);
      setAnnouncement(`Row deselected: ${rowLabel}`);
    } else {
      setSelectedRowId(row.id);
      setAnnouncement(`Row selected: ${rowLabel}`);
    }

    onRowSelect?.(row);
  };

  const handleCellKeyDown = (
    event: KeyboardEvent<HTMLTableCellElement>,
    rowIndex: number,
    colIndex: number,
    row: T,
  ) => {
    const { key } = event;

    if (key === 'Enter') {
      event.preventDefault();
      activateRow(row, 'select');
      return;
    }

    if (key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      activateRow(row, 'toggle');
      return;
    }

    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (key) {
      case 'ArrowUp':
        nextRow = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        nextRow = Math.min(pageRows.length - 1, rowIndex + 1);
        break;
      case 'ArrowLeft':
        nextCol = Math.max(0, colIndex - 1);
        break;
      case 'ArrowRight':
        nextCol = Math.min(columns.length - 1, colIndex + 1);
        break;
      case 'Home':
        nextCol = 0;
        break;
      case 'End':
        nextCol = columns.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusCell(nextRow, nextCol);
  };

  const handleSort = (column: ColumnDef<T>) => {
    if (!column.sortable) return;

    const direction: SortDirection =
      sort?.key === column.accessorKey && sort.direction === 'asc'
        ? 'desc'
        : 'asc';

    setSort({ key: column.accessorKey, direction });
    setCurrentPage(1);
    setAnnouncement(
      `Sorted by ${column.header}, ${direction === 'asc' ? 'ascending' : 'descending'}.`,
    );
  };

  const getAriaSort = (column: ColumnDef<T>) => {
    if (!column.sortable || sort?.key !== column.accessorKey) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <section className="data-grid">
      <p id={instructionsId} className="sr-only">
        Use the arrow keys to move between cells. Press Enter to select a row,
        or Space to toggle its selection. Use Tab to reach the column sort
        buttons and the pagination controls.
      </p>

      <form
        className="data-grid__toolbar"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="data-grid__filter-label" htmlFor={filterId}>
          Filter records
        </label>
        <input
          id={filterId}
          className="data-grid__filter"
          type="search"
          value={filterText}
          onChange={(event) => {
            setFilterText(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search name, role, or status"
          autoComplete="off"
          aria-describedby={instructionsId}
        />
      </form>

      <p className="data-grid__summary" role="status" aria-live="polite">
        {resultSummary}
      </p>

      <div className="data-grid__table-wrap">
        <table
          ref={tableRef}
          className="data-grid__table"
          role="grid"
          aria-label={ariaLabel}
          aria-describedby={instructionsId}
          aria-rowcount={filteredData.length + 1}
          aria-colcount={columns.length}
          aria-multiselectable={false}
        >
          <thead>
            <tr role="row" aria-rowindex={1}>
              {columns.map((column, colIndex) => (
                <th
                  key={String(column.accessorKey)}
                  scope="col"
                  role="columnheader"
                  aria-colindex={colIndex + 1}
                  aria-sort={column.sortable ? getAriaSort(column) : undefined}
                  className={
                    column.sortable
                      ? 'data-grid__header data-grid__header--sortable'
                      : 'data-grid__header'
                  }
                  onClick={
                    column.sortable ? () => handleSort(column) : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="data-grid__sort-button"
                      aria-label={`Sort by ${column.header}`}
                    >
                      <span>{column.header}</span>
                      <span className="data-grid__sort-icon" aria-hidden="true">
                        {sort?.key === column.accessorKey
                          ? sort.direction === 'asc'
                            ? '▲'
                            : '▼'
                          : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, rowIndex) => {
              const isSelected = selectedRowId === row.id;

              return (
                <tr
                  key={row.id}
                  role="row"
                  aria-rowindex={startIndex + rowIndex + 2}
                  aria-selected={isSelected}
                  className={
                    isSelected ? 'data-grid__row data-grid__row--selected' : 'data-grid__row'
                  }
                >
                  {columns.map((column, colIndex) => {
                    const isFocused =
                      focusedCell.row === rowIndex &&
                      focusedCell.col === colIndex;

                    return (
                      <td
                        key={`${row.id}-${String(column.accessorKey)}`}
                        role="gridcell"
                        aria-colindex={colIndex + 1}
                        tabIndex={isFocused ? 0 : -1}
                        data-cell={`${rowIndex}-${colIndex}`}
                        className="data-grid__cell"
                        onFocus={() =>
                          setFocusedCell({ row: rowIndex, col: colIndex })
                        }
                        onKeyDown={(event) =>
                          handleCellKeyDown(event, rowIndex, colIndex, row)
                        }
                      >
                        {formatCellValue(row[column.accessorKey])}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <nav className="data-grid__pagination" aria-label="Table pagination">
        <button
          type="button"
          className="data-grid__page-button"
          onClick={() => setCurrentPage(safePage - 1)}
          disabled={safePage <= 1}
          aria-label="Previous Page"
        >
          Previous
        </button>

        <p className="data-grid__page-status">
          Page {safePage} of {totalPages}
        </p>

        <button
          type="button"
          className="data-grid__page-button"
          onClick={() => setCurrentPage(safePage + 1)}
          disabled={safePage >= totalPages || filteredData.length === 0}
          aria-label="Next Page"
        >
          Next
        </button>
      </nav>
    </section>
  );
}
