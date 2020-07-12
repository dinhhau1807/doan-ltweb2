import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown, Checkbox, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { debounce, find } from 'lodash';

import './FilterOptions.scss';

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
          //trigger change filter when unchecking a option
          emitChangeDebounced(value);

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

  function emitChangeFilter(key, value) {
    const filterParams = { ...paramsTable, page: 1 };
    //remove empty value from params
    filterParams[key] = value ? '' + value : undefined;

    //remove key which its checkbox just been unchecked
    const keyParams = Object.keys(filterParams);
    const ignoreKey = ['page', 'limit', 'sortBy', 'sortType'];
    for (let i = 0; i < keyParams.length; i++) {
      if (ignoreKey.indexOf(keyParams[i]) === -1) {
        const findItem = find(optionsSelected, function (item) {
          return item.columnName === keyParams[i];
        });
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
            <DownOutlined style={{ marginRight: '8px' }} /> Tìm kiếm nâng cao
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
                    <Col
                      key={option.columnName}
                      xs={20}
                      sm={16}
                      md={12}
                      lg={8}
                      xl={6}
                    >
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
