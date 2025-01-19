import { useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // or AdapterDayjs, etc.
import { User } from '../types';
import { useTableColumns } from '../columns/useTableColumns';
import { FetchDataApi } from '../api/fetchData';
import { useUpdateUsers } from '../hooks/useUpdateUsers';




export const Example = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<
  Record<string, string | undefined>
>({});

  const {data,meta,isError, isRefetching, isLoading} =FetchDataApi(columnFilters,globalFilter,pagination,sorting)
//keep track of rows that have been edited
const [editedUsers, setEditedUsers] = useState<Record<string, User>>({})

const { mutateAsync: updateUsers } =useUpdateUsers(); 

const handleSaveUsers = async () => {
  if (Object.values(validationErrors).some((error) => !!error)) return;
  await updateUsers(Object.values(editedUsers));
  setEditedUsers({});
};

  const TableColumns = useTableColumns(validationErrors,
    setValidationErrors,
    editedUsers,
    setEditedUsers);

  const table = useMaterialReactTable({
    columns:TableColumns,
    data,
    enableGrouping: true,
    initialState: { showColumnFilters: true ,
         expanded: true, 
         grouping: ['firstName', 'lastName'], 
    },
    muiToolbarAlertBannerProps: isError ? {
      color: 'error',
      children: 'Error loading data',
    } : undefined,
    manualPagination: true,
    enablePagination: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (paginationState) => {
      setPagination(paginationState);
    },
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
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


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table}/>
    </LocalizationProvider>
  );
};