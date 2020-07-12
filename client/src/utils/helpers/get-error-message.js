export const getErrorMessage = (error, message = 'Something went wrong!') => {
  try {
    return error &&
      error.data &&
      error.data.message &&
      typeof error.data.message === 'string'
      ? error.data.message
      : message;
  } catch (e) {
    return message;
  }
};
