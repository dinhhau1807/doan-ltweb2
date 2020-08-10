import React from 'react';
import {
  UserOutlined,
  UserAddOutlined,
  FileOutlined,
  ApartmentOutlined,
  DesktopOutlined,
  SettingOutlined,
  CreditCardOutlined
} from '@ant-design/icons';

export const TOKEN_KEY = 'token';
export const LOGIN_URL = '/login';

export const STAFF_TABS = {
  CUSTOMER: { to: '/', label: 'CUSTOMERS', icon: <UserOutlined /> },
  IDENTITY: {
    to: '/identities',
    label: 'Identities',
    icon: <UserAddOutlined />
  },
  TRANSACTION: {
    to: '/transaction',
    label: 'Transactions',
    icon: <FileOutlined />
  },
  STAFF: { to: '/staffs', label: 'Staffs', icon: <ApartmentOutlined /> }
};

export const CUSTOMER_TABS = {
  ACCOUNT: { to: '/', label: 'Account', icon: <DesktopOutlined /> },
  TRANSACTION: {
    to: '/transaction',
    label: 'Transfer',
    icon: <FileOutlined />
  },
  DEPOSIT: {
    to: '/deposit-request',
    label: 'Deposit',
    icon: <CreditCardOutlined />
  },
  UTILS: { to: '/profile', label: 'Utilities', icon: <SettingOutlined /> }
};

export const ENTITY_STATUS = {
  inactive: { label: 'Inactive', color: '#fbc02d' },
  active: { label: 'Active', color: '#64dd17' },
  blocked: { label: 'Blocked', color: '#9e9e9e' },
  deleted: { label: 'Deleted', color: '#d50000' }
};

export const TRANSACTION_STATUS = {
  pending: { label: 'Pending', color: '#fbc02d' },
  succeed: { label: 'Succeed', color: '#64dd17' },
  failed: { label: 'Failed', color: '#d50000' }
};

export const DATE_FORMAT = 'YYYY/MM/DD';
export const HOUR_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const MIN_DEPOSIT_AMOUNT = 3000000;

export const countriesCallingCode = [
  {
    id: 1,
    name: 'Afghanistan',
    callingCode: '+93',
    flag: 'https://restcountries.eu/data/afg.svg'
  },
  {
    id: 2,
    name: 'Åland Islands',
    callingCode: '+358',
    flag: 'https://restcountries.eu/data/ala.svg'
  },
  {
    id: 3,
    name: 'Albania',
    callingCode: '+355',
    flag: 'https://restcountries.eu/data/alb.svg'
  },
  {
    id: 4,
    name: 'Algeria',
    callingCode: '+213',
    flag: 'https://restcountries.eu/data/dza.svg'
  },
  {
    id: 5,
    name: 'American Samoa',
    callingCode: '+1684',
    flag: 'https://restcountries.eu/data/asm.svg'
  },
  {
    id: 6,
    name: 'Andorra',
    callingCode: '+376',
    flag: 'https://restcountries.eu/data/and.svg'
  },
  {
    id: 7,
    name: 'Angola',
    callingCode: '+244',
    flag: 'https://restcountries.eu/data/ago.svg'
  },
  {
    id: 8,
    name: 'Anguilla',
    callingCode: '+1264',
    flag: 'https://restcountries.eu/data/aia.svg'
  },
  {
    id: 9,
    name: 'Antarctica',
    callingCode: '+672',
    flag: 'https://restcountries.eu/data/ata.svg'
  },
  {
    id: 10,
    name: 'Antigua and Barbuda',
    callingCode: '+1268',
    flag: 'https://restcountries.eu/data/atg.svg'
  },
  {
    id: 11,
    name: 'Argentina',
    callingCode: '+54',
    flag: 'https://restcountries.eu/data/arg.svg'
  },
  {
    id: 12,
    name: 'Armenia',
    callingCode: '+374',
    flag: 'https://restcountries.eu/data/arm.svg'
  },
  {
    id: 13,
    name: 'Aruba',
    callingCode: '+297',
    flag: 'https://restcountries.eu/data/abw.svg'
  },
  {
    id: 14,
    name: 'Australia',
    callingCode: '+61',
    flag: 'https://restcountries.eu/data/aus.svg'
  },
  {
    id: 15,
    name: 'Austria',
    callingCode: '+43',
    flag: 'https://restcountries.eu/data/aut.svg'
  },
  {
    id: 16,
    name: 'Azerbaijan',
    callingCode: '+994',
    flag: 'https://restcountries.eu/data/aze.svg'
  },
  {
    id: 17,
    name: 'Bahamas',
    callingCode: '+1242',
    flag: 'https://restcountries.eu/data/bhs.svg'
  },
  {
    id: 18,
    name: 'Bahrain',
    callingCode: '+973',
    flag: 'https://restcountries.eu/data/bhr.svg'
  },
  {
    id: 19,
    name: 'Bangladesh',
    callingCode: '+880',
    flag: 'https://restcountries.eu/data/bgd.svg'
  },
  {
    id: 20,
    name: 'Barbados',
    callingCode: '+1246',
    flag: 'https://restcountries.eu/data/brb.svg'
  },
  {
    id: 21,
    name: 'Belarus',
    callingCode: '+375',
    flag: 'https://restcountries.eu/data/blr.svg'
  },
  {
    id: 22,
    name: 'Belgium',
    callingCode: '+32',
    flag: 'https://restcountries.eu/data/bel.svg'
  },
  {
    id: 23,
    name: 'Belize',
    callingCode: '+501',
    flag: 'https://restcountries.eu/data/blz.svg'
  },
  {
    id: 24,
    name: 'Benin',
    callingCode: '+229',
    flag: 'https://restcountries.eu/data/ben.svg'
  },
  {
    id: 25,
    name: 'Bermuda',
    callingCode: '+1441',
    flag: 'https://restcountries.eu/data/bmu.svg'
  },
  {
    id: 26,
    name: 'Bhutan',
    callingCode: '+975',
    flag: 'https://restcountries.eu/data/btn.svg'
  },
  {
    id: 27,
    name: 'Bolivia (Plurinational State of)',
    callingCode: '+591',
    flag: 'https://restcountries.eu/data/bol.svg'
  },
  {
    id: 28,
    name: 'Bonaire, Sint Eustatius and Saba',
    callingCode: '+5997',
    flag: 'https://restcountries.eu/data/bes.svg'
  },
  {
    id: 29,
    name: 'Bosnia and Herzegovina',
    callingCode: '+387',
    flag: 'https://restcountries.eu/data/bih.svg'
  },
  {
    id: 30,
    name: 'Botswana',
    callingCode: '+267',
    flag: 'https://restcountries.eu/data/bwa.svg'
  },
  {
    id: 32,
    name: 'Brazil',
    callingCode: '+55',
    flag: 'https://restcountries.eu/data/bra.svg'
  },
  {
    id: 33,
    name: 'British Indian Ocean Territory',
    callingCode: '+246',
    flag: 'https://restcountries.eu/data/iot.svg'
  },
  {
    id: 35,
    name: 'Virgin Islands (British)',
    callingCode: '+1284',
    flag: 'https://restcountries.eu/data/vgb.svg'
  },
  {
    id: 36,
    name: 'Virgin Islands (U.S.)',
    callingCode: '+1 340',
    flag: 'https://restcountries.eu/data/vir.svg'
  },
  {
    id: 37,
    name: 'Brunei Darussalam',
    callingCode: '+673',
    flag: 'https://restcountries.eu/data/brn.svg'
  },
  {
    id: 38,
    name: 'Bulgaria',
    callingCode: '+359',
    flag: 'https://restcountries.eu/data/bgr.svg'
  },
  {
    id: 39,
    name: 'Burkina Faso',
    callingCode: '+226',
    flag: 'https://restcountries.eu/data/bfa.svg'
  },
  {
    id: 40,
    name: 'Burundi',
    callingCode: '+257',
    flag: 'https://restcountries.eu/data/bdi.svg'
  },
  {
    id: 41,
    name: 'Cambodia',
    callingCode: '+855',
    flag: 'https://restcountries.eu/data/khm.svg'
  },
  {
    id: 42,
    name: 'Cameroon',
    callingCode: '+237',
    flag: 'https://restcountries.eu/data/cmr.svg'
  },
  {
    id: 43,
    name: 'Canada',
    callingCode: '+1',
    flag: 'https://restcountries.eu/data/can.svg'
  },
  {
    id: 44,
    name: 'Cabo Verde',
    callingCode: '+238',
    flag: 'https://restcountries.eu/data/cpv.svg'
  },
  {
    id: 45,
    name: 'Cayman Islands',
    callingCode: '+1345',
    flag: 'https://restcountries.eu/data/cym.svg'
  },
  {
    id: 46,
    name: 'Central African Republic',
    callingCode: '+236',
    flag: 'https://restcountries.eu/data/caf.svg'
  },
  {
    id: 47,
    name: 'Chad',
    callingCode: '+235',
    flag: 'https://restcountries.eu/data/tcd.svg'
  },
  {
    id: 48,
    name: 'Chile',
    callingCode: '+56',
    flag: 'https://restcountries.eu/data/chl.svg'
  },
  {
    id: 49,
    name: 'China',
    callingCode: '+86',
    flag: 'https://restcountries.eu/data/chn.svg'
  },
  {
    id: 50,
    name: 'Christmas Island',
    callingCode: '+61',
    flag: 'https://restcountries.eu/data/cxr.svg'
  },
  {
    id: 51,
    name: 'Cocos (Keeling) Islands',
    callingCode: '+61',
    flag: 'https://restcountries.eu/data/cck.svg'
  },
  {
    id: 52,
    name: 'Colombia',
    callingCode: '+57',
    flag: 'https://restcountries.eu/data/col.svg'
  },
  {
    id: 53,
    name: 'Comoros',
    callingCode: '+269',
    flag: 'https://restcountries.eu/data/com.svg'
  },
  {
    id: 54,
    name: 'Congo',
    callingCode: '+242',
    flag: 'https://restcountries.eu/data/cog.svg'
  },
  {
    id: 55,
    name: 'Congo (Democratic Republic of the)',
    callingCode: '+243',
    flag: 'https://restcountries.eu/data/cod.svg'
  },
  {
    id: 56,
    name: 'Cook Islands',
    callingCode: '+682',
    flag: 'https://restcountries.eu/data/cok.svg'
  },
  {
    id: 57,
    name: 'Costa Rica',
    callingCode: '+506',
    flag: 'https://restcountries.eu/data/cri.svg'
  },
  {
    id: 58,
    name: 'Croatia',
    callingCode: '+385',
    flag: 'https://restcountries.eu/data/hrv.svg'
  },
  {
    id: 59,
    name: 'Cuba',
    callingCode: '+53',
    flag: 'https://restcountries.eu/data/cub.svg'
  },
  {
    id: 60,
    name: 'Curaçao',
    callingCode: '+599',
    flag: 'https://restcountries.eu/data/cuw.svg'
  },
  {
    id: 61,
    name: 'Cyprus',
    callingCode: '+357',
    flag: 'https://restcountries.eu/data/cyp.svg'
  },
  {
    id: 62,
    name: 'Czech Republic',
    callingCode: '+420',
    flag: 'https://restcountries.eu/data/cze.svg'
  },
  {
    id: 63,
    name: 'Denmark',
    callingCode: '+45',
    flag: 'https://restcountries.eu/data/dnk.svg'
  },
  {
    id: 64,
    name: 'Djibouti',
    callingCode: '+253',
    flag: 'https://restcountries.eu/data/dji.svg'
  },
  {
    id: 65,
    name: 'Dominica',
    callingCode: '+1767',
    flag: 'https://restcountries.eu/data/dma.svg'
  },
  {
    id: 66,
    name: 'Dominican Republic',
    callingCode: '+1809',
    flag: 'https://restcountries.eu/data/dom.svg'
  },
  {
    id: 67,
    name: 'Ecuador',
    callingCode: '+593',
    flag: 'https://restcountries.eu/data/ecu.svg'
  },
  {
    id: 68,
    name: 'Egypt',
    callingCode: '+20',
    flag: 'https://restcountries.eu/data/egy.svg'
  },
  {
    id: 69,
    name: 'El Salvador',
    callingCode: '+503',
    flag: 'https://restcountries.eu/data/slv.svg'
  },
  {
    id: 70,
    name: 'Equatorial Guinea',
    callingCode: '+240',
    flag: 'https://restcountries.eu/data/gnq.svg'
  },
  {
    id: 71,
    name: 'Eritrea',
    callingCode: '+291',
    flag: 'https://restcountries.eu/data/eri.svg'
  },
  {
    id: 72,
    name: 'Estonia',
    callingCode: '+372',
    flag: 'https://restcountries.eu/data/est.svg'
  },
  {
    id: 73,
    name: 'Ethiopia',
    callingCode: '+251',
    flag: 'https://restcountries.eu/data/eth.svg'
  },
  {
    id: 74,
    name: 'Falkland Islands (Malvinas)',
    callingCode: '+500',
    flag: 'https://restcountries.eu/data/flk.svg'
  },
  {
    id: 75,
    name: 'Faroe Islands',
    callingCode: '+298',
    flag: 'https://restcountries.eu/data/fro.svg'
  },
  {
    id: 76,
    name: 'Fiji',
    callingCode: '+679',
    flag: 'https://restcountries.eu/data/fji.svg'
  },
  {
    id: 77,
    name: 'Finland',
    callingCode: '+358',
    flag: 'https://restcountries.eu/data/fin.svg'
  },
  {
    id: 78,
    name: 'France',
    callingCode: '+33',
    flag: 'https://restcountries.eu/data/fra.svg'
  },
  {
    id: 79,
    name: 'French Guiana',
    callingCode: '+594',
    flag: 'https://restcountries.eu/data/guf.svg'
  },
  {
    id: 80,
    name: 'French Polynesia',
    callingCode: '+689',
    flag: 'https://restcountries.eu/data/pyf.svg'
  },
  {
    id: 82,
    name: 'Gabon',
    callingCode: '+241',
    flag: 'https://restcountries.eu/data/gab.svg'
  },
  {
    id: 83,
    name: 'Gambia',
    callingCode: '+220',
    flag: 'https://restcountries.eu/data/gmb.svg'
  },
  {
    id: 84,
    name: 'Georgia',
    callingCode: '+995',
    flag: 'https://restcountries.eu/data/geo.svg'
  },
  {
    id: 85,
    name: 'Germany',
    callingCode: '+49',
    flag: 'https://restcountries.eu/data/deu.svg'
  },
  {
    id: 86,
    name: 'Ghana',
    callingCode: '+233',
    flag: 'https://restcountries.eu/data/gha.svg'
  },
  {
    id: 87,
    name: 'Gibraltar',
    callingCode: '+350',
    flag: 'https://restcountries.eu/data/gib.svg'
  },
  {
    id: 88,
    name: 'Greece',
    callingCode: '+30',
    flag: 'https://restcountries.eu/data/grc.svg'
  },
  {
    id: 89,
    name: 'Greenland',
    callingCode: '+299',
    flag: 'https://restcountries.eu/data/grl.svg'
  },
  {
    id: 90,
    name: 'Grenada',
    callingCode: '+1473',
    flag: 'https://restcountries.eu/data/grd.svg'
  },
  {
    id: 91,
    name: 'Guadeloupe',
    callingCode: '+590',
    flag: 'https://restcountries.eu/data/glp.svg'
  },
  {
    id: 92,
    name: 'Guam',
    callingCode: '+1671',
    flag: 'https://restcountries.eu/data/gum.svg'
  },
  {
    id: 93,
    name: 'Guatemala',
    callingCode: '+502',
    flag: 'https://restcountries.eu/data/gtm.svg'
  },
  {
    id: 94,
    name: 'Guernsey',
    callingCode: '+44',
    flag: 'https://restcountries.eu/data/ggy.svg'
  },
  {
    id: 95,
    name: 'Guinea',
    callingCode: '+224',
    flag: 'https://restcountries.eu/data/gin.svg'
  },
  {
    id: 96,
    name: 'Guinea-Bissau',
    callingCode: '+245',
    flag: 'https://restcountries.eu/data/gnb.svg'
  },
  {
    id: 97,
    name: 'Guyana',
    callingCode: '+592',
    flag: 'https://restcountries.eu/data/guy.svg'
  },
  {
    id: 98,
    name: 'Haiti',
    callingCode: '+509',
    flag: 'https://restcountries.eu/data/hti.svg'
  },
  {
    id: 100,
    name: 'Holy See',
    callingCode: '+379',
    flag: 'https://restcountries.eu/data/vat.svg'
  },
  {
    id: 101,
    name: 'Honduras',
    callingCode: '+504',
    flag: 'https://restcountries.eu/data/hnd.svg'
  },
  {
    id: 102,
    name: 'Hong Kong',
    callingCode: '+852',
    flag: 'https://restcountries.eu/data/hkg.svg'
  },
  {
    id: 103,
    name: 'Hungary',
    callingCode: '+36',
    flag: 'https://restcountries.eu/data/hun.svg'
  },
  {
    id: 104,
    name: 'Iceland',
    callingCode: '+354',
    flag: 'https://restcountries.eu/data/isl.svg'
  },
  {
    id: 105,
    name: 'India',
    callingCode: '+91',
    flag: 'https://restcountries.eu/data/ind.svg'
  },
  {
    id: 106,
    name: 'Indonesia',
    callingCode: '+62',
    flag: 'https://restcountries.eu/data/idn.svg'
  },
  {
    id: 107,
    name: "Côte d'Ivoire",
    callingCode: '+225',
    flag: 'https://restcountries.eu/data/civ.svg'
  },
  {
    id: 108,
    name: 'Iran (Islamic Republic of)',
    callingCode: '+98',
    flag: 'https://restcountries.eu/data/irn.svg'
  },
  {
    id: 109,
    name: 'Iraq',
    callingCode: '+964',
    flag: 'https://restcountries.eu/data/irq.svg'
  },
  {
    id: 110,
    name: 'Ireland',
    callingCode: '+353',
    flag: 'https://restcountries.eu/data/irl.svg'
  },
  {
    id: 111,
    name: 'Isle of Man',
    callingCode: '+44',
    flag: 'https://restcountries.eu/data/imn.svg'
  },
  {
    id: 112,
    name: 'Israel',
    callingCode: '+972',
    flag: 'https://restcountries.eu/data/isr.svg'
  },
  {
    id: 113,
    name: 'Italy',
    callingCode: '+39',
    flag: 'https://restcountries.eu/data/ita.svg'
  },
  {
    id: 114,
    name: 'Jamaica',
    callingCode: '+1876',
    flag: 'https://restcountries.eu/data/jam.svg'
  },
  {
    id: 115,
    name: 'Japan',
    callingCode: '+81',
    flag: 'https://restcountries.eu/data/jpn.svg'
  },
  {
    id: 116,
    name: 'Jersey',
    callingCode: '+44',
    flag: 'https://restcountries.eu/data/jey.svg'
  },
  {
    id: 117,
    name: 'Jordan',
    callingCode: '+962',
    flag: 'https://restcountries.eu/data/jor.svg'
  },
  {
    id: 118,
    name: 'Kazakhstan',
    callingCode: '+76',
    flag: 'https://restcountries.eu/data/kaz.svg'
  },
  {
    id: 119,
    name: 'Kenya',
    callingCode: '+254',
    flag: 'https://restcountries.eu/data/ken.svg'
  },
  {
    id: 120,
    name: 'Kiribati',
    callingCode: '+686',
    flag: 'https://restcountries.eu/data/kir.svg'
  },
  {
    id: 121,
    name: 'Kuwait',
    callingCode: '+965',
    flag: 'https://restcountries.eu/data/kwt.svg'
  },
  {
    id: 122,
    name: 'Kyrgyzstan',
    callingCode: '+996',
    flag: 'https://restcountries.eu/data/kgz.svg'
  },
  {
    id: 123,
    name: "Lao People's Democratic Republic",
    callingCode: '+856',
    flag: 'https://restcountries.eu/data/lao.svg'
  },
  {
    id: 124,
    name: 'Latvia',
    callingCode: '+371',
    flag: 'https://restcountries.eu/data/lva.svg'
  },
  {
    id: 125,
    name: 'Lebanon',
    callingCode: '+961',
    flag: 'https://restcountries.eu/data/lbn.svg'
  },
  {
    id: 126,
    name: 'Lesotho',
    callingCode: '+266',
    flag: 'https://restcountries.eu/data/lso.svg'
  },
  {
    id: 127,
    name: 'Liberia',
    callingCode: '+231',
    flag: 'https://restcountries.eu/data/lbr.svg'
  },
  {
    id: 128,
    name: 'Libya',
    callingCode: '+218',
    flag: 'https://restcountries.eu/data/lby.svg'
  },
  {
    id: 129,
    name: 'Liechtenstein',
    callingCode: '+423',
    flag: 'https://restcountries.eu/data/lie.svg'
  },
  {
    id: 130,
    name: 'Lithuania',
    callingCode: '+370',
    flag: 'https://restcountries.eu/data/ltu.svg'
  },
  {
    id: 131,
    name: 'Luxembourg',
    callingCode: '+352',
    flag: 'https://restcountries.eu/data/lux.svg'
  },
  {
    id: 132,
    name: 'Macao',
    callingCode: '+853',
    flag: 'https://restcountries.eu/data/mac.svg'
  },
  {
    id: 133,
    name: 'Macedonia (the former Yugoslav Republic of)',
    callingCode: '+389',
    flag: 'https://restcountries.eu/data/mkd.svg'
  },
  {
    id: 134,
    name: 'Madagascar',
    callingCode: '+261',
    flag: 'https://restcountries.eu/data/mdg.svg'
  },
  {
    id: 135,
    name: 'Malawi',
    callingCode: '+265',
    flag: 'https://restcountries.eu/data/mwi.svg'
  },
  {
    id: 136,
    name: 'Malaysia',
    callingCode: '+60',
    flag: 'https://restcountries.eu/data/mys.svg'
  },
  {
    id: 137,
    name: 'Maldives',
    callingCode: '+960',
    flag: 'https://restcountries.eu/data/mdv.svg'
  },
  {
    id: 138,
    name: 'Mali',
    callingCode: '+223',
    flag: 'https://restcountries.eu/data/mli.svg'
  },
  {
    id: 139,
    name: 'Malta',
    callingCode: '+356',
    flag: 'https://restcountries.eu/data/mlt.svg'
  },
  {
    id: 140,
    name: 'Marshall Islands',
    callingCode: '+692',
    flag: 'https://restcountries.eu/data/mhl.svg'
  },
  {
    id: 141,
    name: 'Martinique',
    callingCode: '+596',
    flag: 'https://restcountries.eu/data/mtq.svg'
  },
  {
    id: 142,
    name: 'Mauritania',
    callingCode: '+222',
    flag: 'https://restcountries.eu/data/mrt.svg'
  },
  {
    id: 143,
    name: 'Mauritius',
    callingCode: '+230',
    flag: 'https://restcountries.eu/data/mus.svg'
  },
  {
    id: 144,
    name: 'Mayotte',
    callingCode: '+262',
    flag: 'https://restcountries.eu/data/myt.svg'
  },
  {
    id: 145,
    name: 'Mexico',
    callingCode: '+52',
    flag: 'https://restcountries.eu/data/mex.svg'
  },
  {
    id: 146,
    name: 'Micronesia (Federated States of)',
    callingCode: '+691',
    flag: 'https://restcountries.eu/data/fsm.svg'
  },
  {
    id: 147,
    name: 'Moldova (Republic of)',
    callingCode: '+373',
    flag: 'https://restcountries.eu/data/mda.svg'
  },
  {
    id: 148,
    name: 'Monaco',
    callingCode: '+377',
    flag: 'https://restcountries.eu/data/mco.svg'
  },
  {
    id: 149,
    name: 'Mongolia',
    callingCode: '+976',
    flag: 'https://restcountries.eu/data/mng.svg'
  },
  {
    id: 150,
    name: 'Montenegro',
    callingCode: '+382',
    flag: 'https://restcountries.eu/data/mne.svg'
  },
  {
    id: 151,
    name: 'Montserrat',
    callingCode: '+1664',
    flag: 'https://restcountries.eu/data/msr.svg'
  },
  {
    id: 152,
    name: 'Morocco',
    callingCode: '+212',
    flag: 'https://restcountries.eu/data/mar.svg'
  },
  {
    id: 153,
    name: 'Mozambique',
    callingCode: '+258',
    flag: 'https://restcountries.eu/data/moz.svg'
  },
  {
    id: 154,
    name: 'Myanmar',
    callingCode: '+95',
    flag: 'https://restcountries.eu/data/mmr.svg'
  },
  {
    id: 155,
    name: 'Namibia',
    callingCode: '+264',
    flag: 'https://restcountries.eu/data/nam.svg'
  },
  {
    id: 156,
    name: 'Nauru',
    callingCode: '+674',
    flag: 'https://restcountries.eu/data/nru.svg'
  },
  {
    id: 157,
    name: 'Nepal',
    callingCode: '+977',
    flag: 'https://restcountries.eu/data/npl.svg'
  },
  {
    id: 158,
    name: 'Netherlands',
    callingCode: '+31',
    flag: 'https://restcountries.eu/data/nld.svg'
  },
  {
    id: 159,
    name: 'New Caledonia',
    callingCode: '+687',
    flag: 'https://restcountries.eu/data/ncl.svg'
  },
  {
    id: 160,
    name: 'New Zealand',
    callingCode: '+64',
    flag: 'https://restcountries.eu/data/nzl.svg'
  },
  {
    id: 161,
    name: 'Nicaragua',
    callingCode: '+505',
    flag: 'https://restcountries.eu/data/nic.svg'
  },
  {
    id: 162,
    name: 'Niger',
    callingCode: '+227',
    flag: 'https://restcountries.eu/data/ner.svg'
  },
  {
    id: 163,
    name: 'Nigeria',
    callingCode: '+234',
    flag: 'https://restcountries.eu/data/nga.svg'
  },
  {
    id: 164,
    name: 'Niue',
    callingCode: '+683',
    flag: 'https://restcountries.eu/data/niu.svg'
  },
  {
    id: 165,
    name: 'Norfolk Island',
    callingCode: '+672',
    flag: 'https://restcountries.eu/data/nfk.svg'
  },
  {
    id: 166,
    name: "Korea (Democratic People's Republic of)",
    callingCode: '+850',
    flag: 'https://restcountries.eu/data/prk.svg'
  },
  {
    id: 167,
    name: 'Northern Mariana Islands',
    callingCode: '+1670',
    flag: 'https://restcountries.eu/data/mnp.svg'
  },
  {
    id: 168,
    name: 'Norway',
    callingCode: '+47',
    flag: 'https://restcountries.eu/data/nor.svg'
  },
  {
    id: 169,
    name: 'Oman',
    callingCode: '+968',
    flag: 'https://restcountries.eu/data/omn.svg'
  },
  {
    id: 170,
    name: 'Pakistan',
    callingCode: '+92',
    flag: 'https://restcountries.eu/data/pak.svg'
  },
  {
    id: 171,
    name: 'Palau',
    callingCode: '+680',
    flag: 'https://restcountries.eu/data/plw.svg'
  },
  {
    id: 172,
    name: 'Palestine, State of',
    callingCode: '+970',
    flag: 'https://restcountries.eu/data/pse.svg'
  },
  {
    id: 173,
    name: 'Panama',
    callingCode: '+507',
    flag: 'https://restcountries.eu/data/pan.svg'
  },
  {
    id: 174,
    name: 'Papua New Guinea',
    callingCode: '+675',
    flag: 'https://restcountries.eu/data/png.svg'
  },
  {
    id: 175,
    name: 'Paraguay',
    callingCode: '+595',
    flag: 'https://restcountries.eu/data/pry.svg'
  },
  {
    id: 176,
    name: 'Peru',
    callingCode: '+51',
    flag: 'https://restcountries.eu/data/per.svg'
  },
  {
    id: 177,
    name: 'Philippines',
    callingCode: '+63',
    flag: 'https://restcountries.eu/data/phl.svg'
  },
  {
    id: 178,
    name: 'Pitcairn',
    callingCode: '+64',
    flag: 'https://restcountries.eu/data/pcn.svg'
  },
  {
    id: 179,
    name: 'Poland',
    callingCode: '+48',
    flag: 'https://restcountries.eu/data/pol.svg'
  },
  {
    id: 180,
    name: 'Portugal',
    callingCode: '+351',
    flag: 'https://restcountries.eu/data/prt.svg'
  },
  {
    id: 181,
    name: 'Puerto Rico',
    callingCode: '+1787',
    flag: 'https://restcountries.eu/data/pri.svg'
  },
  {
    id: 182,
    name: 'Qatar',
    callingCode: '+974',
    flag: 'https://restcountries.eu/data/qat.svg'
  },
  {
    id: 183,
    name: 'Republic of Kosovo',
    callingCode: '+383',
    flag: 'https://restcountries.eu/data/kos.svg'
  },
  {
    id: 184,
    name: 'Réunion',
    callingCode: '+262',
    flag: 'https://restcountries.eu/data/reu.svg'
  },
  {
    id: 185,
    name: 'Romania',
    callingCode: '+40',
    flag: 'https://restcountries.eu/data/rou.svg'
  },
  {
    id: 186,
    name: 'Russian Federation',
    callingCode: '+7',
    flag: 'https://restcountries.eu/data/rus.svg'
  },
  {
    id: 187,
    name: 'Rwanda',
    callingCode: '+250',
    flag: 'https://restcountries.eu/data/rwa.svg'
  },
  {
    id: 188,
    name: 'Saint Barthélemy',
    callingCode: '+590',
    flag: 'https://restcountries.eu/data/blm.svg'
  },
  {
    id: 189,
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    callingCode: '+290',
    flag: 'https://restcountries.eu/data/shn.svg'
  },
  {
    id: 190,
    name: 'Saint Kitts and Nevis',
    callingCode: '+1869',
    flag: 'https://restcountries.eu/data/kna.svg'
  },
  {
    id: 191,
    name: 'Saint Lucia',
    callingCode: '+1758',
    flag: 'https://restcountries.eu/data/lca.svg'
  },
  {
    id: 192,
    name: 'Saint Martin (French part)',
    callingCode: '+590',
    flag: 'https://restcountries.eu/data/maf.svg'
  },
  {
    id: 193,
    name: 'Saint Pierre and Miquelon',
    callingCode: '+508',
    flag: 'https://restcountries.eu/data/spm.svg'
  },
  {
    id: 194,
    name: 'Saint Vincent and the Grenadines',
    callingCode: '+1784',
    flag: 'https://restcountries.eu/data/vct.svg'
  },
  {
    id: 195,
    name: 'Samoa',
    callingCode: '+685',
    flag: 'https://restcountries.eu/data/wsm.svg'
  },
  {
    id: 196,
    name: 'San Marino',
    callingCode: '+378',
    flag: 'https://restcountries.eu/data/smr.svg'
  },
  {
    id: 197,
    name: 'Sao Tome and Principe',
    callingCode: '+239',
    flag: 'https://restcountries.eu/data/stp.svg'
  },
  {
    id: 198,
    name: 'Saudi Arabia',
    callingCode: '+966',
    flag: 'https://restcountries.eu/data/sau.svg'
  },
  {
    id: 199,
    name: 'Senegal',
    callingCode: '+221',
    flag: 'https://restcountries.eu/data/sen.svg'
  },
  {
    id: 200,
    name: 'Serbia',
    callingCode: '+381',
    flag: 'https://restcountries.eu/data/srb.svg'
  },
  {
    id: 201,
    name: 'Seychelles',
    callingCode: '+248',
    flag: 'https://restcountries.eu/data/syc.svg'
  },
  {
    id: 202,
    name: 'Sierra Leone',
    callingCode: '+232',
    flag: 'https://restcountries.eu/data/sle.svg'
  },
  {
    id: 203,
    name: 'Singapore',
    callingCode: '+65',
    flag: 'https://restcountries.eu/data/sgp.svg'
  },
  {
    id: 204,
    name: 'Sint Maarten (Dutch part)',
    callingCode: '+1721',
    flag: 'https://restcountries.eu/data/sxm.svg'
  },
  {
    id: 205,
    name: 'Slovakia',
    callingCode: '+421',
    flag: 'https://restcountries.eu/data/svk.svg'
  },
  {
    id: 206,
    name: 'Slovenia',
    callingCode: '+386',
    flag: 'https://restcountries.eu/data/svn.svg'
  },
  {
    id: 207,
    name: 'Solomon Islands',
    callingCode: '+677',
    flag: 'https://restcountries.eu/data/slb.svg'
  },
  {
    id: 208,
    name: 'Somalia',
    callingCode: '+252',
    flag: 'https://restcountries.eu/data/som.svg'
  },
  {
    id: 209,
    name: 'South Africa',
    callingCode: '+27',
    flag: 'https://restcountries.eu/data/zaf.svg'
  },
  {
    id: 210,
    name: 'South Georgia and the South Sandwich Islands',
    callingCode: '+500',
    flag: 'https://restcountries.eu/data/sgs.svg'
  },
  {
    id: 211,
    name: 'Korea (Republic of)',
    callingCode: '+82',
    flag: 'https://restcountries.eu/data/kor.svg'
  },
  {
    id: 212,
    name: 'South Sudan',
    callingCode: '+211',
    flag: 'https://restcountries.eu/data/ssd.svg'
  },
  {
    id: 213,
    name: 'Spain',
    callingCode: '+34',
    flag: 'https://restcountries.eu/data/esp.svg'
  },
  {
    id: 214,
    name: 'Sri Lanka',
    callingCode: '+94',
    flag: 'https://restcountries.eu/data/lka.svg'
  },
  {
    id: 215,
    name: 'Sudan',
    callingCode: '+249',
    flag: 'https://restcountries.eu/data/sdn.svg'
  },
  {
    id: 216,
    name: 'Suriname',
    callingCode: '+597',
    flag: 'https://restcountries.eu/data/sur.svg'
  },
  {
    id: 217,
    name: 'Svalbard and Jan Mayen',
    callingCode: '+4779',
    flag: 'https://restcountries.eu/data/sjm.svg'
  },
  {
    id: 218,
    name: 'Swaziland',
    callingCode: '+268',
    flag: 'https://restcountries.eu/data/swz.svg'
  },
  {
    id: 219,
    name: 'Sweden',
    callingCode: '+46',
    flag: 'https://restcountries.eu/data/swe.svg'
  },
  {
    id: 220,
    name: 'Switzerland',
    callingCode: '+41',
    flag: 'https://restcountries.eu/data/che.svg'
  },
  {
    id: 221,
    name: 'Syrian Arab Republic',
    callingCode: '+963',
    flag: 'https://restcountries.eu/data/syr.svg'
  },
  {
    id: 222,
    name: 'Taiwan',
    callingCode: '+886',
    flag: 'https://restcountries.eu/data/twn.svg'
  },
  {
    id: 223,
    name: 'Tajikistan',
    callingCode: '+992',
    flag: 'https://restcountries.eu/data/tjk.svg'
  },
  {
    id: 224,
    name: 'Tanzania, United Republic of',
    callingCode: '+255',
    flag: 'https://restcountries.eu/data/tza.svg'
  },
  {
    id: 225,
    name: 'Thailand',
    callingCode: '+66',
    flag: 'https://restcountries.eu/data/tha.svg'
  },
  {
    id: 226,
    name: 'Timor-Leste',
    callingCode: '+670',
    flag: 'https://restcountries.eu/data/tls.svg'
  },
  {
    id: 227,
    name: 'Togo',
    callingCode: '+228',
    flag: 'https://restcountries.eu/data/tgo.svg'
  },
  {
    id: 228,
    name: 'Tokelau',
    callingCode: '+690',
    flag: 'https://restcountries.eu/data/tkl.svg'
  },
  {
    id: 229,
    name: 'Tonga',
    callingCode: '+676',
    flag: 'https://restcountries.eu/data/ton.svg'
  },
  {
    id: 230,
    name: 'Trinidad and Tobago',
    callingCode: '+1868',
    flag: 'https://restcountries.eu/data/tto.svg'
  },
  {
    id: 231,
    name: 'Tunisia',
    callingCode: '+216',
    flag: 'https://restcountries.eu/data/tun.svg'
  },
  {
    id: 232,
    name: 'Turkey',
    callingCode: '+90',
    flag: 'https://restcountries.eu/data/tur.svg'
  },
  {
    id: 233,
    name: 'Turkmenistan',
    callingCode: '+993',
    flag: 'https://restcountries.eu/data/tkm.svg'
  },
  {
    id: 234,
    name: 'Turks and Caicos Islands',
    callingCode: '+1649',
    flag: 'https://restcountries.eu/data/tca.svg'
  },
  {
    id: 235,
    name: 'Tuvalu',
    callingCode: '+688',
    flag: 'https://restcountries.eu/data/tuv.svg'
  },
  {
    id: 236,
    name: 'Uganda',
    callingCode: '+256',
    flag: 'https://restcountries.eu/data/uga.svg'
  },
  {
    id: 237,
    name: 'Ukraine',
    callingCode: '+380',
    flag: 'https://restcountries.eu/data/ukr.svg'
  },
  {
    id: 238,
    name: 'United Arab Emirates',
    callingCode: '+971',
    flag: 'https://restcountries.eu/data/are.svg'
  },
  {
    id: 239,
    name: 'United Kingdom of Great Britain and Northern Ireland',
    callingCode: '+44',
    flag: 'https://restcountries.eu/data/gbr.svg'
  },
  {
    id: 240,
    name: 'United States of America',
    callingCode: '+1',
    flag: 'https://restcountries.eu/data/usa.svg'
  },
  {
    id: 241,
    name: 'Uruguay',
    callingCode: '+598',
    flag: 'https://restcountries.eu/data/ury.svg'
  },
  {
    id: 242,
    name: 'Uzbekistan',
    callingCode: '+998',
    flag: 'https://restcountries.eu/data/uzb.svg'
  },
  {
    id: 243,
    name: 'Vanuatu',
    callingCode: '+678',
    flag: 'https://restcountries.eu/data/vut.svg'
  },
  {
    id: 244,
    name: 'Venezuela (Bolivarian Republic of)',
    callingCode: '+58',
    flag: 'https://restcountries.eu/data/ven.svg'
  },
  {
    id: 245,
    name: 'Viet Nam',
    callingCode: '+84',
    flag: 'https://restcountries.eu/data/vnm.svg'
  },
  {
    id: 246,
    name: 'Wallis and Futuna',
    callingCode: '+681',
    flag: 'https://restcountries.eu/data/wlf.svg'
  },
  {
    id: 247,
    name: 'Western Sahara',
    callingCode: '+212',
    flag: 'https://restcountries.eu/data/esh.svg'
  },
  {
    id: 248,
    name: 'Yemen',
    callingCode: '+967',
    flag: 'https://restcountries.eu/data/yem.svg'
  },
  {
    id: 249,
    name: 'Zambia',
    callingCode: '+260',
    flag: 'https://restcountries.eu/data/zmb.svg'
  },
  {
    id: 250,
    name: 'Zimbabwe',
    callingCode: '+263',
    flag: 'https://restcountries.eu/data/zwe.svg'
  }
];
