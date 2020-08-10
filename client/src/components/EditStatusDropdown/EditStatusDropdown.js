import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';

// Styles
import './EditStatusDropdown.scss';

const propTypes = {
  statusList: PropTypes.array,
  iteme: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

const defaultProps = {};

const EditStatusDropdown = ({
  statusList,
  item,
  onChangeStatus,
  disabled,
  children
}) => {
  const onClickMenu = ({ key }) => {
    onChangeStatus(item.id, key);
  };

  return (
    <Dropdown
      overlay={
        <Menu onClick={onClickMenu}>
          {statusList.map(({ key, label }) => (
            <Menu.Item key={key} disabled={disabled}>
              <span>{label}</span>
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
};

EditStatusDropdown.propTypes = propTypes;
EditStatusDropdown.defaultProps = defaultProps;

export default EditStatusDropdown;
