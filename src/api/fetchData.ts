import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';

export const useUpdateUsers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (users: User[]) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake API call
      return Promise.resolve();
    },
    onMutate: (newUsers: User[]) => {
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.map((user: User) => {
          const newUser = newUsers.find((u) => u.id === user.id);
          return newUser ? newUser : user;
        }),
      );
    },
  });
};
