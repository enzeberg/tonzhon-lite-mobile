import React, { Component } from 'react';
import { List } from 'antd';
import { connect } from 'react-redux';

import artistsReducer from '../../utils/artists_reducer';
import neteaseMusicLogo from '../../images/netease_16.ico';
import qqMusicLogo from '../../images/qq_16.ico';
import kuwoMusicLogo from '../../images/kuwo_16.ico';

class SongItem extends Component {
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick() {
    const index = this.props.playingList.findIndex(
      song => song.newId === this.props.song.newId);
    if (index === -1) {
      this.props.addToPlayingList(this.props.song);
      this.props.updatePlayIndex(this.props.playingList.length);
    } else {
      this.props.updatePlayIndex(index);
    }
  }

  render() {
    const { song, showPlatform } = this.props;
    const { newId, name, artists, platform } = song;
    return (
      <List.Item
        key={newId}
        onClick={this.onItemClick}
        style={{
          padding: '10px 0',
        }}
      >
        <List.Item.Meta
          title={name}
          description={artistsReducer(artists)}
        />
        {
          showPlatform &&
            <img
              src={logos[platform]}
              alt={platform}
              style={{
                width: 16,
                height: 16,
              }}
            />
        }
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongItem);