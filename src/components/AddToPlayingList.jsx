import React, { Component } from 'react';
import { message, Button } from 'antd';
import { connect } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

class AddToPlayingList extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.addToPlayingList(this.props.data);
    message.success('已添加');
  }

  render() {
    return (
      <Button
        icon={<PlusOutlined />}
        onClick={this.handleClick}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToPlayingList: (data) => {
      dispatch({ type: 'ADD_TO_PLAYING_LIST', data: data });
    },
  };
}

export default connect(null, mapDispatchToProps)(AddToPlayingList);