export const FILTER_CUSTOMERS = {
  // default column
  default: {
    columnName: 'username',
    placeholder: 'Nhập username'
  },

  //optional columns
  options: [
    {
      label: 'Họ tên',
      type: 'input',
      columnName: 'name',
      placeholder: ''
    },
    {
      label: 'Email',
      type: 'input',
      columnName: 'email',
      placeholder: ''
    },
    {
      label: 'Điện thoại',
      type: 'input',
      columnName: 'phone',
      placeholder: ''
    },
    {
      label: 'Địa chỉ',
      type: 'input',
      columnName: 'address',
      placeholder: ''
    }
  ]
};

export const FILTER_STAFFS = {
  // default column
  default: {
    columnName: 'username',
    placeholder: 'Nhập username'
  },

  //optional columns
  options: [
    {
      label: 'Họ tên',
      type: 'input',
      columnName: 'name',
      placeholder: ''
    }
  ]
};
