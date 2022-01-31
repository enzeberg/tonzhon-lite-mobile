import React, { Component } from 'react';
import { List } from 'antd';
import { connect } from 'react-redux';

import neteaseMusicLogo from '../../images/netease_16.ico';
import qqMusicLogo from '../../images/qq_16.ico';
import kuwoMusicLogo from '../../images/kuwo_16.ico';

const logos = {
  qq: qqMusicLogo,
  netease: neteaseMusicLogo,
  kuwo: kuwoMusicLogo,
};

class SongItem extends Component {
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick() {
    const index = this.props.playlist.findIndex(
      song => song.newId === this.props.song.newId);
    if (index === -1) {
      this.props.addToPlaylist(this.props.song);
      this.props.updatePlayIndex(this.props.playlist.length);
    } else {
      this.props.updatePlayIndex(index);
    }
  }

  render() {
    let { song, showPlatform } = this.props;
    return (
      <List.Item
        key={song.newId}
        onClick={this.onItemClick}
        style={{
          padding: '10px 0',
        }}
      >
        <List.Item.Meta title={song.name}
          description={song.artists.map(artist => artist.name)
            .reduce((accumulator, currentValue) =>
              accumulator + ' / ' + currentValue
            )}
        />
        {
          showPlatform &&
            <img src={logos[song.platform]}
              alt={song.platform}
              style={{ width: 16, height: 16 }}
            />
        }
      </List.Item>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentSong: state.playlist[state.playIndex],
    playlist: state.playlist,
    playAction: state.playAction,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongItem);