import React, { Component } from 'react';
import { Pagination } from 'antd';
import { connect } from 'react-redux';

import SongList from './SongList';
import Wrapper from './Wrapper';
import OperatingBarOfSongList from './OperatingBarOfSongList';

class Result extends Component {
  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
  }

  onPageChange(page) {
    const { keyword, platform, onResultResponded } = this.props;
    fetch(`/api/search?keyword=${keyword}&platform=${platform}&page=${page}`)
      .then(res => res.json())
      .then(json => {
        onResultResponded(platform, json);
      })
      .catch(err => {
        console.log('err ', err);
      });
  }

  render() {
    const { result, platform } = this.props;
    let mainPart;
    if (result.searchSuccess) {
      mainPart = <SongList songs={result.data.songs} />;
    } else {
      mainPart = <h3>{result.message}</h3>;
    }

    return (
      <Wrapper
        platform={platform}
        pagination={
          result.searchSuccess &&
          <Pagination
            simple
            onChange={this.onPageChange}
            defaultPageSize={4}
            total={result.data.totalCount}
          />
        }
        operatingBar={
          result.searchSuccess &&
          <OperatingBarOfSongList songs={result.data.songs} />
        }
      >
        {mainPart}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    keyword: state.searchKeyword,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onResultResponded: (platform, data) => {
      dispatch({ type: 'UPDATE_SEARCH_RESULTS', platform, data });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);