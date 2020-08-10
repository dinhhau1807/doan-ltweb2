import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

// Styles
import './EditStatusDropdown.scss';

const propTypes = {
  statusList: PropTypes.array,
  iteme: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired
};

const defaultProps = {};

const EditStatusDropdown = ({ statusList, item, onChangeStatus, disabled }) => {
  const onClickMenu = ({ key }) => {
    onChangeStatus(item.id, key);
  };

  return (
    <Menu onClick={onClickMenu}>
      {statusList.map(({ key, label }) => (
        <Menu.Item key={key} disabled={disabled}>
          <span>{label}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
};

EditStatusDropdown.propTypes = propTypes;
EditStatusDropdown.defaultProps = defaultProps;

export default EditStatusDropdown;
