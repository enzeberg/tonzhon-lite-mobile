import React, { Component } from 'react';
import { List } from 'antd';

import SongItem from './SongItem';

class SongList extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let { songs, showPlatform } = this.props;
    return (
      <List
        dataSource={songs}
        renderItem={song => {
          return (
            <SongItem key={song.link}
              song={song}
              showPlatform={showPlatform}
            />
          );
        }}
      />
    );
  }
}

export default SongList;