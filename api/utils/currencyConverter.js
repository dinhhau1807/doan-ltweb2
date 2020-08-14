const fx = require('money');
const CURRENCY_UNIT = require('./enums/currencyUnitEnum');
const AppError = require('./appError');

const convert = (value) => {
  return {
    from: (base) => {
      switch (base) {
        case CURRENCY_UNIT.VND:
          fx.base = CURRENCY_UNIT.VND;
          fx.rates = {
            VND: 1,
            USD: 0.000043,
          };
          return fx(value).from(CURRENCY_UNIT.VND);

        case CURRENCY_UNIT.USD:
          fx.base = CURRENCY_UNIT.USD;
          fx.rates = {
            USD: 1,
            VND: 23192,
          };
          return fx(value).from(CURRENCY_UNIT.USD);

        default:
          throw new AppError('Invalid currency unit!', 400);
      }
    },
  };
};

module.exports = convert;
