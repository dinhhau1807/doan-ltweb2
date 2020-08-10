import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

// Styles
import './ComponentHeader.scss';

const propTypes = {
  tabs: PropTypes.object,
  selectedTab: PropTypes.string,
  title: PropTypes.string.isRequired
};

const ComponentHeader = ({ tabs, selectedTab, title }) => {
  return (
    <div className="component-header">
      <h2 className="page-header">{title}</h2>
      <div className="component-header__wrap">
        <Menu
          className="component-header__menu"
          selectedKeys={[selectedTab]}
          mode="horizontal"
          style={{ textAlign: 'right' }}
        >
          {Object.keys(tabs).map(key => (
            <Menu.Item className="component-header__item" key={tabs[key].to}>
              <Link to={tabs[key].to}>{tabs[key].label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  );
};

ComponentHeader.propTypes = propTypes;

export default ComponentHeader;
