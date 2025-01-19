import { useMaterialReactTable } from 'material-react-table';
import type { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import type { User } from '../types';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

export const useTableConfig = ({
  columns,
  data,
  meta,
  state,
  setColumnFilters,
  setGlobalFilter,
  setPagination,
  setSorting,
  handleSaveUsers,
  isError,
  isRefetching,
  isLoading,
  validationErrors,
  editedUsers,
}: {
  columns: any;
  data: User[];
  meta: { totalRowCount: number };
  state: {
    columnFilters: MRT_ColumnFiltersState;
    globalFilter: string;
    pagination: MRT_PaginationState;
    sorting: MRT_SortingState;
  };
  setColumnFilters: (filters: MRT_ColumnFiltersState) => void;
  setGlobalFilter: (filter: string) => void;
  setPagination: (pagination: MRT_PaginationState) => void;
  setSorting: (sorting: MRT_SortingState) => void;
  handleSaveUsers: () => void;
  isError: boolean;
  isRefetching: boolean;
  isLoading: boolean;
  validationErrors: Record<string, string | undefined>;
  editedUsers: Record<string, User>;
}) => {
  // Custom handler for sorting state
  const handleSortingChange = (
    updaterOrValue: MRT_SortingState | ((prev: MRT_SortingState) => MRT_SortingState)
  ) => {
    if (typeof updaterOrValue === 'function') {
      setSorting((prev: MRT_SortingState) => updaterOrValue(prev));
    } else {
      setSorting(updaterOrValue);
    }
  };

  // Custom handler for column filters
  const handleColumnFiltersChange = (
    updaterOrValue: MRT_ColumnFiltersState | ((prev: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)
  ) => {
    if (typeof updaterOrValue === 'function') {
      setColumnFilters((prev: MRT_ColumnFiltersState) => updaterOrValue(prev));
    } else {
      setColumnFilters(updaterOrValue);
    }
  };

  // Custom handler for pagination
  const handlePaginationChange = (
    updaterOrValue: MRT_PaginationState | ((prev: MRT_PaginationState) => MRT_PaginationState)
  ) => {
    if (typeof updaterOrValue === 'function') {
      setPagination((prev: MRT_PaginationState) => updaterOrValue(prev));
    } else {
      setPagination(updaterOrValue);
    }
  };

  return useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    groupedColumnMode: 'reorder',
    initialState: {
      showColumnFilters: true,
      expanded: true,
      grouping: ['firstName', 'lastName'],
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    manualPagination: true,
    enablePagination: true,
    onColumnFiltersChange: handleColumnFiltersChange, // Updated to use the custom handler
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: handlePaginationChange, // Updated to use the custom handler
    onSortingChange: handleSortingChange, // Already updated
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      isLoading,
      pagination: state.pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting: state.sorting,
    },
    enableColumnResizing: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    enableColumnOrdering: true,
    editDisplayMode: 'cell',
    enableCellActions: true,
    enableEditing: true,
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={
            Object.keys(editedUsers).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          Save
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
  });
};
