import React, { Component } from 'react';
import { Row, Col } from 'antd';

import neteaseMusicLogo from '../images/netease_16.ico';
import qqMusicLogo from '../images/qq_16.ico';
import kuwoMusicLogo from '../images/kuwo_16.ico';

class Wrapper extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { platform, pagination, operatingBar } = this.props;
    const logo = logos[platform];
    return (
      <div
        style={{
          borderRadius: 5,
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
        }}
      >
        <Row type="flex" align="middle">
          <Col span={2}>
            <img src={logo} alt={platform} />
          </Col>
          <Col span={16}>
            {pagination}
          </Col>
          <Col span={6}>
            {operatingBar}
          </Col>
        </Row>
        {this.props.children}
      </div>
    );
  }
}

const logos = {
  qq: qqMusicLogo,
  netease: neteaseMusicLogo,
  kuwo: kuwoMusicLogo,
};

export default Wrapper;