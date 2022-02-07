import React, { Component } from 'react';
import { Button, List, Row, Col, Drawer } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import ItemInPlayingList from './SongItem/in_playing_list';

class PlayingList extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Drawer
        visible={this.props.visible}
        placement="bottom"
        mask={false}
        height={500}
        closable={false}
        bodyStyle={{
          padding: '0 0 70px',
        }}
        style={{
          zIndex: 10,
        }}
        title={
          <Row type="flex" align="middle">
            <Col span={18}>播放列表</Col>
            <Col span={6}
              style={{
                textAlign: 'right',
              }}
            >
              <Button icon={<DeleteOutlined />}
                onClick={this.props.clearPlayingList}
              >
                清空
              </Button>
            </Col>
          </Row>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={this.props.dataSource}
          size="small"
          renderItem={song => (
            <ItemInPlayingList song={song} />
          )}
          style={{
            overflow: 'auto',
            height: '400px',
          }}
        />
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataSource: state.playingList,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    clearPlayingList: () => {
      dispatch({ type: 'CLEAR_PLAYING_LIST' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayingList);