import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { DataGrid, type ColumnDef, type DataGridProps } from './DataGrid';
import { mockData, type UserData } from '../data';

const columns: ColumnDef<UserData>[] = [
  { header: 'ID', accessorKey: 'id', sortable: true },
  { header: 'Name', accessorKey: 'name', sortable: true },
  { header: 'Role', accessorKey: 'role', sortable: true },
  { header: 'Status', accessorKey: 'status', sortable: true },
];

function renderGrid(props: Partial<DataGridProps<UserData>> = {}) {
  return render(
    <DataGrid
      data={mockData}
      columns={columns}
      ariaLabel="User management directory"
      {...props}
    />,
  );
}

describe('DataGrid', () => {
  it('renders native table semantics and roving tab index', () => {
    renderGrid();

    const grid = screen.getByRole('grid', {
      name: 'User management directory',
    });
    const headers = screen.getAllByRole('columnheader');
    const cells = screen.getAllByRole('gridcell');

    expect(grid.tagName).toBe('TABLE');
    expect(headers).toHaveLength(columns.length);
    headers.forEach((header) => {
      expect(header.tagName).toBe('TH');
      expect(header).toHaveAttribute('scope', 'col');
    });

    expect(cells[0]).toHaveAttribute('tabindex', '0');
    expect(
      cells.filter((cell) => cell.getAttribute('tabindex') === '0'),
    ).toHaveLength(1);
    expect(cells[1]).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with arrow keys using a single roving tab stop', async () => {
    const user = userEvent.setup();
    renderGrid();

    const cells = screen.getAllByRole('gridcell');
    cells[0].focus();

    await user.keyboard('{ArrowRight}');
    expect(cells[1]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(cells[5]).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(cells[4]).toHaveFocus();

    const focusableCells = screen
      .getAllByRole('gridcell')
      .filter((cell) => cell.getAttribute('tabindex') === '0');

    expect(focusableCells).toHaveLength(1);
    expect(focusableCells[0]).toBe(cells[4]);
  });

  it('selects on Enter and toggles on Space', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();
    renderGrid({ onRowSelect });

    const firstCell = screen.getAllByRole('gridcell')[0];
    const firstRow = firstCell.closest('tr');

    firstCell.focus();
    await user.keyboard('{Enter}');

    expect(onRowSelect).toHaveBeenCalledWith(mockData[0]);
    expect(firstRow).toHaveAttribute('aria-selected', 'true');

    await user.keyboard(' ');

    expect(firstRow).toHaveAttribute('aria-selected', 'false');
    expect(onRowSelect).toHaveBeenCalledTimes(2);
  });

  it('filters across string properties and keeps pagination in sync', async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.type(
      screen.getByRole('searchbox', { name: 'Filter records' }),
      'Developer',
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('Showing 1–4 of 4 records.'),
        ).toBeInTheDocument();
      },
      { timeout: 1500 },
    );

    expect(screen.getAllByRole('row')).toHaveLength(5);
  });

  it('sorts by column and exposes aria-sort', async () => {
    const user = userEvent.setup();
    renderGrid();

    const sortByName = screen.getByRole('button', { name: 'Sort by Name' });
    const nameHeader = sortByName.closest('th');

    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(sortByName);
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    await user.click(sortByName);
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('paginates five rows at a time', async () => {
    const user = userEvent.setup();
    renderGrid();

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next Page' }));

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(
      screen.getByText('Showing 6–10 of 15 records.'),
    ).toBeInTheDocument();
  });

  it('has no automated accessibility violations', async () => {
    const { container } = renderGrid();
    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });
});
