import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown, Checkbox, Row, Col, DatePicker, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { debounce, find } from 'lodash';
import { DATE_FORMAT } from '../../constants/GlobalConstants';

import './FilterOptions.scss';

const { RangePicker } = DatePicker;

const breakpoints = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 6
};

const propTypes = {
  columnFilter: PropTypes.object,
  paramsTable: PropTypes.object,
  fetchData: PropTypes.func.isRequired
};

const defaultProps = {};

const FilterOptions = ({ columnFilter, paramsTable, fetchData }) => {
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const emitChangeDebounced = debounce(emitChangeFilter, 400);

  const onVisibleDropdownChange = flag => {
    setVisibleDropdown(flag);
  };

  const onCheckboxChange = e => {
    const { value, checked } = e.target;
    const selectedList = [...optionsSelected];
    if (checked) {
      //add checked option
      for (let i = 0; i < columnFilter.options.length; i++) {
        if (columnFilter.options[i].columnName === value) {
          selectedList.push(columnFilter.options[i]);
          break;
        }
      }
    } else {
      //remove unchecked option from selectedList
      for (let i = 0; i < selectedList.length; i++) {
        if (selectedList[i].columnName === value) {
          selectedList.splice(i, 1);
          break;
        }
      }
    }

    setOptionsSelected(selectedList);
  };

  const onInputChange = e => {
    const { name, value } = e.target;
    emitChangeDebounced(name, value);
  };

  const onDatePickerChange = (date, dateString, columnName) => {
    const dateSearch = date ? date.format(DATE_FORMAT) : undefined;
    emitChangeDebounced(columnName, dateSearch);
  };

  const onRangePickerChange = (date, dateString, columnName) => {
    const dateSearch = [];

    date && date[0]
      ? dateSearch.push(date[0].format(DATE_FORMAT))
      : dateSearch.push(undefined);
    date && date[1]
      ? dateSearch.push(date[1].format(DATE_FORMAT))
      : dateSearch.push(undefined);

    emitChangeDebounced(columnName, dateSearch);
  };

  const onSelectChange = columnName => value => {
    emitChangeDebounced(columnName, value);
  };

  function emitChangeFilter(key, value) {
    const filterParams = { ...paramsTable, page: 1 };

    //range picker case
    //remove empty value from params
    if (Array.isArray(key) && Array.isArray(value)) {
      key.forEach((item, index) => {
        filterParams[item] = value[index]
          ? ('' + value[index]).trim()
          : undefined;
      });
    } else {
      filterParams[key] = value ? ('' + value).trim() : undefined;
    }

    //remove key which its checkbox unchecked
    const keyParams = Object.keys(filterParams);
    const ignoreKey = ['page', 'limit', 'sortBy', 'sortType'];
    for (let i = 0; i < keyParams.length; i++) {
      if (ignoreKey.indexOf(keyParams[i]) === -1) {
        const findItem = find(optionsSelected, function (item) {
          if (Array.isArray(item.columnName)) {
            return item.columnName.indexOf(keyParams[i]) > -1;
          }
          return item.columnName === keyParams[i];
        });
        //*: except for the default column
        if (!findItem && keyParams[i] !== columnFilter.default.columnName) {
          filterParams[keyParams[i]] = undefined;
        }
      }
    }
    fetchData(filterParams);
  }

  return (
    <div className="filter">
      <div className="filter__content">
        <Input
          className="filter__default"
          name={columnFilter.default.columnName}
          placeholder={columnFilter.default.placeholder}
          onChange={onInputChange}
        />
        <Dropdown
          style={{ background: '#fff' }}
          onVisibleChange={onVisibleDropdownChange}
          visible={visibleDropdown}
          trigger={['click']}
          overlay={
            <div className="filter__dropdown">
              <Checkbox.Group>
                {columnFilter.options.map((chbok, index) => {
                  return (
                    <div key={index} className="filter__checkbox">
                      <Checkbox
                        value={chbok.columnName}
                        onChange={onCheckboxChange}
                      >
                        {chbok.label}
                      </Checkbox>
                    </div>
                  );
                })}
              </Checkbox.Group>
            </div>
          }
        >
          <span className="filter__dropdown-label">
            <DownOutlined style={{ marginRight: '8px' }} /> Advanced search
          </span>
        </Dropdown>
      </div>
      {optionsSelected.length > 0 && (
        <div className="filter__options">
          <Row gutter={16}>
            {optionsSelected.map(option => {
              switch (option.type) {
                case 'input':
                  return (
                    <Col key={option.columnName} {...breakpoints}>
                      <div className="filter__option">
                        <label htmlFor={option.columnName}>
                          {option.label}
                        </label>
                        <Input
                          id={option.columnName}
                          name={option.columnName}
                          placeholder={option.placeholder}
                          onChange={onInputChange}
                        />
                      </div>
                    </Col>
                  );
                case 'datepicker':
                  return (
                    <Col key={option.columnName} {...breakpoints}>
                      <div className="filter__option">
                        <label htmlFor={option.columnName}>
                          {option.label}
                        </label>
                        <DatePicker
                          style={{ display: 'block' }}
                          format={DATE_FORMAT}
                          id={option.columnName}
                          name={option.columnName}
                          placeholder={option.placeholder}
                          onChange={(date, dateString) =>
                            onDatePickerChange(
                              date,
                              dateString,
                              option.columnName
                            )
                          }
                        />
                      </div>
                    </Col>
                  );
                case 'select':
                  return (
                    <Col key={option.columnName} {...breakpoints}>
                      <div className="filter__option">
                        <label htmlFor={option.columnName}>
                          {option.label}
                        </label>
                        <Select
                          style={{ display: 'block' }}
                          id={option.columnName}
                          name={option.columnName}
                          placeholder={option.placeholder}
                          onChange={onSelectChange(option.columnName)}
                          defaultValue=""
                        >
                          {!!option.options &&
                            option.options.map((item, index) => (
                              <Select.Option value={item.key} key={index}>
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    </Col>
                  );
                case 'rangePicker':
                  return (
                    <Col key={option.columnName} {...breakpoints}>
                      <div className="filter__option">
                        <label htmlFor={option.columnName}>
                          {option.label}
                        </label>
                        <RangePicker
                          style={{ width: '100%' }}
                          id={option.columnName}
                          format={DATE_FORMAT}
                          onChange={(date, dateString) =>
                            onRangePickerChange(
                              date,
                              dateString,
                              option.columnName
                            )
                          }
                        />
                      </div>
                    </Col>
                  );
                default:
                  return null;
              }
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

FilterOptions.propTypes = propTypes;
FilterOptions.defaultProps = defaultProps;

export default FilterOptions;
