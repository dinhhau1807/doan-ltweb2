export const formatMoney = num => {
  return num
    ? ('' + num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    : num === 0 || num === '0'
    ? '0'
    : '';
};
