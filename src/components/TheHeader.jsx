import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import { themeColor } from '../config';
const { Header } = Layout;

function TheHeader() {
  return (
    <Header
      style={{
        width: '100%',
        zIndex: 2,
        textAlign: 'center',
        borderBottom: '0.5px solid #ccc',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2
          style={{
            display: 'inline',
            color: themeColor,
            fontWeight: 'normal',
            fontSize: 'x-large',
          }}
        >
          Tonzhon Lite
        </h2>
      </Link>
    </Header>
  );
}

export default TheHeader;