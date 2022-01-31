import React, { Component } from 'react';
import { message, Button } from 'antd';
import { connect } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

class AddTo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.addToPlaylist(this.props.data);
    message.success('已添加');
  }

  render() {
    return (
      <Button
        title="添加到播放列表"
        onClick={this.handleClick}
        shape="circle"
        icon={<PlusOutlined />}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToPlaylist: (data) => {
      dispatch({ type: 'ADD_TO_PLAYLIST', data: data });
    },
  };
}

export default connect(null, mapDispatchToProps)(AddTo);