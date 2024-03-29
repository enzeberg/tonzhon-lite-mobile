import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Spin } from 'antd';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import TheHeader from './components/TheHeader';
import SearchBar from './components/SearchBar';
import Result from './components/Result';
import SearchWithURL from './components/SearchWithURL';
import NotFound from './components/NotFound';
import TopSongs from './components/TopSongs';
import Player from './components/Player';
import './App.less';

const { Content } = Layout;

class App extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let { searchStatus, searchResults } = this.props;
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/search" component={SearchWithURL} />
          </Switch>
          <TheHeader />
          <Content>
            <div
              style={{
                padding: '10px',
                marginBottom: '50px',
                minHeight: '800px',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <SearchBar />
              </div>
              <Switch>
                <Route exact path="/" />
                <Route
                  path="/search"
                  render={
                    () => {
                      const platforms = Object.keys(searchResults);
                      return (
                        <>
                          <TopSongs />
                          {
                            platforms.map((platform) => (
                              <Result
                                key={platform}
                                platform={platform}
                                data={searchResults[platform]}
                              />
                            ))
                          }
                          {
                            searchStatus === 'searching' && <Spin />
                          }
                        </>
                      );
                    }
                  }
                />
                <Route path="/*" component={NotFound} />
              </Switch>
            </div>
          </Content>
          <Player />
        </Layout>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchStatus: state.searchStatus,
    searchResults: state.searchResults,
  };
}

export default connect(mapStateToProps)(App);