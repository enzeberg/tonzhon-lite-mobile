import React, { Component } from 'react';
import { List, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

import neteaseMusicLogo from '../../images/netease_16.ico';
import qqMusicLogo from '../../images/qq_16.ico';
import kuwoMusicLogo from '../../images/kuwo_16.ico';


class SongItem extends Component {
  constructor(props) {
    super(props);

    this.onMainPartClick = this.onMainPartClick.bind(this);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onMainPartClick() {
    const index = this.props.playlist.findIndex(song =>
      song.newId === this.props.song.newId);
    if (index === -1) {
      this.props.addToPlaylist(this.props.song);
      this.props.updatePlayIndex(this.props.playlist.length);
    } else {
      this.props.updatePlayIndex(index);
    }
  }

  onDeleteBtnClick() {
    const index = this.props.playlist.findIndex(song =>
      song.newId === this.props.song.newId);
    if (index + 1 === this.props.playlist.length) {
      this.props.updatePlayIndex(0);
    }
    this.props.deleteSongInPlaylist(index, this.props.playIndex);
  }

  render() {
    let { song } = this.props;
    return (
      <List.Item style={{ padding: '8px 10px' }}>
        <Row type="flex" align="middle"
          style={{
            width: '100%',
          }}
        >
          <Col span={22}
            onClick={this.onMainPartClick}
          >
            <Row align="middle">
              <Col span={13}>
                <div className="nowrap">
                  <span>{song.name}</span>
                </div>
              </Col>
              <Col span={9}>
                <div className="nowrap">
                  {
                    song.artists.map(artist => artist.name)
                      .reduce((accumulator, currentValue) =>
                        accumulator + ' / ' + currentValue
                      )
                  }
                </div>
              </Col>
              <Col span={2}>
                <img src={logos[song.platform]} alt={song.platform} />
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Button
              title="删除"
              onClick={this.onDeleteBtnClick}
              icon={<DeleteOutlined />}
            />
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
    currentSong: state.playlist[state.playIndex],
    playlist: state.playlist,
    playIndex: state.playIndex,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addToPlaylist: (song) => {
      dispatch({ type: 'ADD_TO_PLAYLIST', data: song });
    },
    updatePlayIndex: (index) => {
      dispatch({ type: 'UPDATE_PLAY_INDEX', data: index });
    },
    deleteSongInPlaylist: (indexToDelete, playIndex) => {
      dispatch({ type: 'DELETE_SONG_IN_PLAYLIST', data: indexToDelete });
      if (indexToDelete < playIndex) {
        dispatch({ type: 'UPDATE_PLAY_INDEX', data: playIndex - 1 });
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongItem);