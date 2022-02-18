import React, { Component } from 'react';
import { Input } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Search = Input.Search;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(keyword) {
    if (keyword !== '' && keyword !== this.props.keyword) {
      this.props.updateSearchKeyword(keyword);
      this.props.history.push(`/search?keyword=${keyword}`);
    }
  }

  render() {
    // const { keyword } = this.props;

    return (
      <Search
        placeholder="歌曲 | 专辑 | 艺人"
        // defaultValue={ keyword || '' }
        onSearch={this.onSearch}
        enterButton
        size="large"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    keyword: state.searchKeyword
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateSearchKeyword: (keyword) => {
      dispatch({ type: 'UPDATE_SEARCH_KEYWORD', data: keyword });
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBar));