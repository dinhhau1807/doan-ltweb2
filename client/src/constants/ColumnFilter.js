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

export const FILTER_IDENTITIES = {
  // default column
  default: {
    columnName: 'identityNumber',
    placeholder: 'Nhập CMND'
  },

  //optional columns
  options: [
    {
      label: 'Mã khách hàng',
      type: 'input',
      columnName: 'customerId',
      placeholder: ''
    },
    {
      label: 'Ngày đăng kí',
      type: 'datepicker',
      columnName: 'registrationDate',
      placeholder: ''
    },
    {
      label: 'Đã xác nhận',
      type: 'select',
      columnName: 'approved',
      options: [
        {
          key: '',
          value: 'All'
        },
        {
          key: 'true',
          value: 'Approved'
        },
        {
          key: 'false',
          value: 'Not Approved'
        }
      ],
      placeholder: ''
    }
  ]
};
