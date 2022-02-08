import React, { Component } from 'react';
import { List, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

import artistsReducer from '../../utils/artists_reducer';
import neteaseMusicLogo from '../../images/netease_16.ico';
import qqMusicLogo from '../../images/qq_16.ico';
import kuwoMusicLogo from '../../images/kuwo_16.ico';

class SongItem extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onRowClick() {
    const index = this.props.playingList.findIndex(song =>
                  song.newId === this.props.song.newId);
    if (index === -1) {
      this.props.addToPlayingList(this.props.song);
      this.props.updatePlayIndex(this.props.playingList.length);
    } else {
      this.props.updatePlayIndex(index);
    }
  }

  onDeleteBtnClick() {
    const index = this.props.playingList.findIndex(song =>
                  song.newId === this.props.song.newId);
    if (this.props.currentSong.newId === this.props.song.newId
        && index + 1 === this.props.playingList.length) {
      this.props.updatePlayIndex(0);
    }
    this.props.deleteSongInPlayingList(index, this.props.playIndex);
  }

  render() {
    let { song } = this.props;
    return (
      <List.Item
        extra={
          <Button
            icon={<DeleteOutlined />}
            size="small"
            onClick={this.onDeleteBtnClick}
          />
        }
        style={{ padding: '0 20px 0 0' }}
      >
        <Row type="flex" align="middle"
          onClick={this.onRowClick}
          style={{
            width: '90%',
            padding: '7px 10px 7px 20px',
          }}
        >
          <Col span={13} className="nowrap">
            {song.name}
          </Col>
          <Col span={9} className="nowrap">
            {
              artistsReducer(song.artists)
            }
          </Col>
          <Col span={2}>
            <img src={logos[song.platform]} alt={song.platform} />
          </Col>
        </Row>
      </List.Item>
    );
  }
}

const logos = {
  qq: qqMusicLogo,
  netease: neteaseMusicLogo,
  kuwo: kuwoMusicLogo,
};

function mapStateToProps(state) {
  return {
    playingList: state.playingList,
    playIndex: state.playIndex,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addToPlayingList: (song) => {
      dispatch({ type: 'ADD_TO_PLAYING_LIST', data: song });
    },
    updatePlayIndex: (index) => {
      dispatch({ type: 'UPDATE_PLAY_INDEX', data: index });
    },
    deleteSongInPlayingList: (indexToDelete, playIndex) => {
      dispatch({ type: 'DELETE_SONG_IN_PLAYING_LIST', data: indexToDelete });
      if (indexToDelete < playIndex) {
        dispatch({ type: 'UPDATE_PLAY_INDEX', data: playIndex - 1 });
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongItem);