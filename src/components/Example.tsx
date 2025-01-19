import {useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { Box, Button, Typography } from '@mui/material';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'; // TanStack React Query V5
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // or AdapterDayjs, etc.

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  lastLogin: Date;
};

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
//keep track of rows that have been edited
const [editedUsers, setEditedUsers] = useState<Record<string, User>>({})

const { mutateAsync: updateUsers } =
useUpdateUsers();
function useUpdateUsers() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (users: User[]) => {
        //send api update request here
        await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
        return Promise.resolve();
      },
      //client side optimistic update
      onMutate: (newUsers: User[]) => {
        queryClient.setQueryData(['users'], (prevUsers: any) =>
          prevUsers?.map((user: User) => {
            const newUser = newUsers.find((u) => u.id === user.id);
            return newUser ? newUser : user;
          }),
        );
      },
    });
  }
const handleSaveUsers = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateUsers(Object.values(editedUsers));
    setEditedUsers({});
  };

  const validateRequired = (value: string) => !!value.length;
  const validatePhoneNumber = (phoneNumber: string) =>
    !!phoneNumber.length &&
    phoneNumber.match(/^\d{10}$/);  // Example: Validate a 10-digit phone number.

    const validateDate = (dateString: string) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());  // Checks if the date is valid.
      };  
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  // Fetch data using useQuery
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users-list',
      { columnFilters, globalFilter, pagination, sorting }, // Dependencies that trigger refetch
    ],
    queryFn: async () => {
      const fetchURL = new URL('http://localhost:5000/data', window.location.origin);

      fetchURL.searchParams.set('_start', `${pagination.pageIndex * pagination.pageSize}`);
      fetchURL.searchParams.set('_limit', `${pagination.pageSize}`);
      console.log("Pagination---State",pagination)

      if (globalFilter) {
        fetchURL.searchParams.set('q', globalFilter); // For simple text search
      }

      if (sorting.length > 0) {
        const sortField = sorting[0]?.id;
        const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
        fetchURL.searchParams.set('_sort', sortField);
        fetchURL.searchParams.set('_order', sortOrder);
      }

      console.log("Fetching data from:", fetchURL.href);

      const response = await fetch(fetchURL.href);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const json = await response.json();

      console.log("API Response:", json);

      // Calculate the total row count by sending a separate query if needed
      const countResponse = await fetch('http://localhost:5000/data');
      const totalCount = countResponse.ok ? (await countResponse.json()).length : 0;

      return {
        data: json,
        meta: { totalRowCount: totalCount }, // Total count for pagination
      };
    },
     placeholderData: keepPreviousData,
  });
  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Incorrect Email Format'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validatePhoneNumber(event.currentTarget.value)
              ? 'Enter 10 Digit Phone Number'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
    {
        accessorFn: (row) => new Date(row.lastLogin),
        id: 'lastLogin',
        header: 'Last Login',
        Cell: ({ cell }) => new Date(cell.getValue<Date>()).toLocaleString(),
        filterFn: 'greaterThan',
        filterVariant: 'date',
        enableGlobalFilter: false,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateDate(event.currentTarget.value)
              ? 'Incorrect date Format'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
  ],  [editedUsers, validationErrors]);

  
  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    // groupedColumnMode,
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
            {/* {validationErrors ? <CircularProgress size={25} /> : 'Save'} */}
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
