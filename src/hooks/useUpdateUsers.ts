
import { User } from '../types';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';


export function useUpdateUsers() {
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
      // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
  }