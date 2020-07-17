export const FILTER_CUSTOMERS = {
  // default column
  default: {
    columnName: 'username',
    placeholder: 'Input username'
  },

  //optional columns
  options: [
    {
      label: 'Fullname',
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
      label: 'Phone',
      type: 'input',
      columnName: 'phone',
      placeholder: ''
    },
    {
      label: 'Address',
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
    placeholder: 'Input username'
  },

  //optional columns
  options: [
    {
      label: 'Fullname',
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
    placeholder: 'Input identification ID No'
  },

  //optional columns
  options: [
    {
      label: 'Customer ID',
      type: 'input',
      columnName: 'customerId',
      placeholder: ''
    },
    {
      label: 'Issued on',
      type: 'datepicker',
      columnName: 'registrationDate',
      placeholder: ''
    },
    {
      label: 'Approved',
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
