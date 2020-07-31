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

export const FILTER_TRANSACTIONS = {
  // default column
  default: {
    columnName: 'accountSourceId',
    placeholder: 'Input the ID of source account'
  },

  //optional columns
  options: [
    {
      label: 'ID of source account',
      type: 'input',
      columnName: 'accountSourceId',
      placeholder: ''
    },
    {
      label: 'ID of destination account',
      type: 'input',
      columnName: 'accountDestination',
      placeholder: ''
    },
    {
      label: 'Bank ID',
      type: 'input',
      columnName: 'bankDestinationId',
      placeholder: ''
    },
    {
      label: 'Created Date',
      type: 'datepicker',
      columnName: 'createDate',
      placeholder: ''
    },
    {
      label: 'From Date - To Date',
      type: 'rangePicker',
      columnName: ['fromDate', 'toDate'],
      placeholder: ''
    },
    {
      label: 'Status',
      type: 'select',
      columnName: 'status',
      options: [
        {
          key: '',
          value: 'All'
        },
        {
          key: 'pending',
          value: 'Pending'
        },
        {
          key: 'succeed',
          value: 'Succeed'
        },
        {
          key: 'failed',
          value: 'Failed'
        }
      ],
      placeholder: ''
    }
  ]
};

export const CUSTOMER_PROFILE_INPUTS = [
  {
    name: 'name',
    label: 'Fullname',
    type: 'input'
  },
  {
    name: 'dateOfBirth',
    label: 'Birthday',
    type: 'datepicker'
  },
  {
    name: 'phoneNumber',
    label: 'Phone',
    type: 'phonecallingcode'
  },
  {
    name: 'address',
    label: 'Address',
    type: 'input'
  }
];

export const STAFF_PROFILE_INPUTS = [
  {
    name: 'name',
    label: 'Fullname',
    type: 'input'
  }
];
