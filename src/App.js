import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import TheHeader from './components/Header';
import SearchBar from './components/SearchBar';
import Result from './components/Result';
import SearchWithURL from './components/SearchWithURL';
import NotFound from './components/NotFound';
import TopSongs from './components/TopSongs';
import Player from './components/Player';
// import { themeColor } from '../../config';
import { LoadingOutlined } from '@ant-design/icons';
import './App.less';

const { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { searchStatus, searchResults } = this.props;
    return (
      <BrowserRouter>
        <Layout style={{ backgroundColor: 'rgb(235,235,235)' }}>
          <Switch>
            <Route path="/search" component={SearchWithURL} />
          </Switch>
          <Header style={{
              width: '100%',
              zIndex: 1040,
              position: 'fixed',
              textAlign: 'center',
            }}
          >
            <TheHeader />
          </Header>
          <Content>
            <div
              style={{
                marginTop: 54,
                padding: '10px',
                marginBottom: 80,
                minHeight: '800px',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <SearchBar />
              </div>
              <Switch>
                <Route exact path="/" />
                <Route path="/search" render={() => (
                  <>
                    <TopSongs />
                    {
                      Object.keys(searchResults).map((key) => (
                        <Result
                          result={searchResults[key]}
                          provider={key}
                          key={key}
                        />
                      ))
                    }
                    <div className="loading-anim-wrapper">
                      {
                        searchStatus === 'searching' &&
                        <LoadingOutlined
                          style={{ fontSize: 30, }}
                        />
                      }
                    </div>
                  </>
                )} />
                <Route path="/*" render={NotFound} />
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
