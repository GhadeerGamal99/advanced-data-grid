export const validateRequired = (value: string) => !!value.length;
export const validatePhoneNumber = (phoneNumber: string) =>
  !!phoneNumber.length && phoneNumber.match(/^\d{10}$/);
export const validateDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
export const validateEmail = (email: string) =>
  !!email.length &&
  email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
