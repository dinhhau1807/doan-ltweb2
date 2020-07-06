import React, { useState } from 'react';
import { Input, Dropdown, Checkbox, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './FilterOptions.scss';

const FilterOptions = ({ columnFilter }) => {
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [optionsSelected, setOptionsSelected] = useState([]);

  const onVisibleDropdownChange = flag => {
    setVisibleDropdown(flag);
  };

  const onChangeCheckbox = e => {
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

  return (
    <div className="filter">
      <div className="filter__content">
        <Input
          className="filter__default"
          name={columnFilter.default.columnName}
          placeholder={columnFilter.default.placeholder}
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
                        onChange={onChangeCheckbox}
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
            {optionsSelected.map((option, index) => {
              return (
                <Col key={index} xs={20} sm={16} md={12} lg={8} xl={6}>
                  <div className="filter__option">
                    <label htmlFor={option.columnName}>{option.label}</label>
                    <Input
                      id={option.columnName}
                      name={option.columnName}
                      placeholder={option.placeholder}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
