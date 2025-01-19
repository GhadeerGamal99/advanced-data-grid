export type UserApiResponse = {
    data: Array<User>;
    meta: {
      totalRowCount: number;
    };
  };
  
  export type User = {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email: string;
    lastLogin: Date;
  };
  