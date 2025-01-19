import { UserApiResponse } from '../types';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

  // Fetch data using useQuery
  export const FetchDataApi = (columnFilters: any, globalFilter: any, pagination: any, sorting: any) => {
    
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
  
    return { data, meta, isError, isRefetching, isLoading };
  }
