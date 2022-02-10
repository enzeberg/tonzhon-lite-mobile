import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Slider, Button, message, Tooltip, Drawer, Space } from 'antd';
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  LoadingOutlined,
  PauseOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  MdRepeat as LoopIcon,
  MdRepeatOne as SingleIcon,
  MdShuffle as ShuffleIcon
} from 'react-icons/md';

import PlayingList from './PlayingList';
import toMinAndSec from '../utils/to_min_and_sec';
import artistsReducer from '../utils/artists_reducer';
import neteaseMusicLogo from '../images/netease_16.ico';
import qqMusicLogo from '../images/qq_16.ico';
import kuwoMusicLogo from '../images/kuwo_16.ico';

const playModeIcons = {
  loop: <LoopIcon className="player-icon" />,
  single: <SingleIcon className="player-icon" />,
  shuffle: <ShuffleIcon className="player-icon" />,
};

const playModes = ['loop', 'single', 'shuffle'];
const modeExplanations = {
  loop: '循环',
  single: '单曲循环',
  shuffle: '随机',
};

const isiOS = Boolean(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStatus: 'pausing',
      playMode: localStorage.getItem('playMode') || 'loop',
      playerDetailsVisible: false,
      playingListVisible: false,
      getSongSourceStatus: 'notYet',
      songSource: null,
      songLoaded: false,
      playProgress: 0,
    };

    this.onCentralBtnClick = this.onCentralBtnClick.bind(this);
    this.onPlayProgressSliderChange = this.onPlayProgressSliderChange.bind(this);
    this.onPlayModeBtnClick = this.onPlayModeBtnClick.bind(this);
    this.onPlayingListBtnClick = this.onPlayingListBtnClick.bind(this);
    this.onLeftPartClick = this.onLeftPartClick.bind(this);
  }

  componentDidMount() {
    this.audio.addEventListener('loadeddata', () => {
      this.setState({
        songLoaded: true,
        songDuration: this.audio.duration,
      });
    });

    this.audio.addEventListener('play', () => {
      if (this.interval) { clearInterval(this.interval); }
      this.interval = setInterval(() => {
        this.setState({
          playProgress: this.audio.currentTime,
        });
      }, 1000);
    });

    this.audio.addEventListener('pause', () => {
      if (this.interval) {
        clearInterval(this.interval);
      }
    });

    this.audio.addEventListener('ended', () => {
      clearInterval(this.interval);
      this.playNext('forward');
    });
  }

  componentDidUpdate(prevProps) {
    const prevSong = prevProps.currentSong;
    const currentSong = this.props.currentSong;

    if (currentSong) {
      // updating playingList will cause component receive props, so the judgement
      // is necessary
      if ((prevSong && currentSong.newId !== prevSong.newId) || !prevSong) {
        this.audio.pause();
        this.getSongSourceAndPlay(currentSong);
      }
    } else {
      if (prevSong) {
        this.setState({
          getSongSourceStatus: 'notYet',
          songSource: null,
          songLoaded: false,
          playProgress: 0,
        });
        this.pause();
      }
    }
  }

  onCentralBtnClick() {
    const { playerStatus } = this.state;
    if (playerStatus === 'pausing') {
      if (this.state.songSource) {
        this.play();
      } else {
        const { currentSong } = this.props;
        this.getSongSourceAndPlay(currentSong);
      }
    } else if (playerStatus === 'playing') {
      this.pause();
    }
  }

  getSongSourceAndPlay(song) {
    this.getSongSource(song.platform, song.originalId, () => {
      if (!isiOS) {
        // playing after getting new src will cause Unhandled Rejection (NotAllowedError) in the development environment of iOS
        this.play();
      }
    });
  }

  play() {
    this.audio.play();
    this.setState({
      playerStatus: 'playing',
    });
  }

  pause() {
    this.audio.pause();
    this.setState({
      playerStatus: 'pausing',
    });
  }

  getSongSource(platform, originalId, callback) {
    this.setState({
      songSource: null,
      songLoaded: false,
      playProgress: 0,
      getSongSourceStatus: 'started',
    });
    fetch(`/api/song_source/${platform}/${originalId}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'ok') {
          this.setState({
            getSongSourceStatus: 'ok',
            songSource: json.data.songSource,
          }, callback);
        } else {
          this.failedToGetSongSource();
        }
      })
      .catch(err => {
        this.failedToGetSongSource();
      });
  }

  failedToGetSongSource() {
    this.setState({
      getSongSourceStatus: 'failed',
    }, () => {
      message.error('加载失败');
      this.playNext('forward');
      message.info('已跳过');
    });
  }

  onPlayProgressSliderChange(value) {
    this.audio.currentTime = value;
    this.setState({ playProgress: value });
  }

  playNext(direction) {
    if (this.state.playerStatus === 'playing') {
      this.pause();
    }
    const { currentSong, playingList } = this.props;
    const { playMode } = this.state;
    if (playMode === 'single' || playingList.length === 1) {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.props.changePlayIndex(currentSong, playingList, playMode, direction);
    }
  }

  onPlayModeBtnClick() {
    const i = playModes.indexOf(this.state.playMode);
    const mode = playModes[i + 1] || playModes[0];
    localStorage.setItem('playMode', mode);
    this.setState({
      playMode: mode,
    });
  }

  onPlayingListBtnClick() {
    this.setState({
      playingListVisible: !this.state.playingListVisible,
    });
  }

  onLeftPartClick() {
    this.setState({
      playerDetailsVisible: !this.state.playerDetailsVisible,
    });
  }

  render() {
    const { playerStatus, getSongSourceStatus, songLoaded } = this.state;
    const { currentSong } = this.props;
    const progress = toMinAndSec(this.state.playProgress);
    const total = toMinAndSec(this.state.songDuration);
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          padding: '6px 20px',
          width: '100%',
          background: '#222',
          color: 'white',
          zIndex: 1001, // .ant-drawer's z-index = 1000
        }}
      >
        <audio
          src={this.state.songSource}
          ref={(audio) => { this.audio = audio; }}
        />

        <Drawer
          visible={this.state.playerDetailsVisible}
          onCancel={this.handleCancel}
          // bodyStyle={{
          //   backgroundColor: 'rgba(100, 100, 100, 0.7)'
          // }}
          placement="bottom"
          mask={false}
          // destroyOnClose
          closable={false}
        >
          <div
            style={{
              textAlign: 'right',
              height: '22px', // 不设高度会造成：因为内容变化导致下方抖动
            }}
          >
            {
              songLoaded
              ? (
                <>
                  <span>{progress}</span>
                  <span> / {total}</span>
                </>
              )
              : (
                getSongSourceStatus === 'started'
                ? <LoadingOutlined />
                : (
                  getSongSourceStatus === 'ok'
                  ? <LoadingOutlined />
                  : (
                    getSongSourceStatus === 'failed' && '加载失败'
                  )
                )
              )
            }
          </div>
          <Slider
            min={0}
            max={this.state.songDuration ? parseInt(this.state.songDuration) : 0}
            value={this.state.playProgress}
            tipFormatter={(value) => toMinAndSec(value)}
            onChange={this.onPlayProgressSliderChange}
            disabled={!this.state.songSource}
            style={{ margin: '0 0 12px 0' }}
          />
          <Row
            type="flex"
            align="middle"
            className="container"
            style={{ marginBottom: 10 }}
          >
            <Col span={20}>
              <Space size="large">
                <Button
                  shape="circle"
                  icon={<StepBackwardOutlined />}
                  onClick={() => this.playNext('backward')}
                />
                <Button
                  shape="circle"
                  icon={<StepForwardOutlined />}
                  onClick={() => this.playNext('forward')}
                />
              </Space>
            </Col>
            <Col span={4}>
              <Tooltip title={modeExplanations[this.state.playMode]}>
                <button
                  onClick={this.onPlayModeBtnClick}
                  style={{
                    border: 'none',
                    background: 'none',
                    float: 'right'
                  }}
                >
                  {playModeIcons[this.state.playMode]}
                </button>
              </Tooltip>
            </Col>
          </Row>
        </Drawer>

        <Row
          type="flex"
          align="middle"
          justify="space-between"
          style={{
            height: '48px',
          }}
        >
          <Col
            span={14}
            onClick={this.onLeftPartClick}
          >
            {
              currentSong && (
                <>
                  <div className="nowrap"
                    style={{
                      fontSize: 16,
                      height: 26,
                    }}
                  >
                    {currentSong.name}
                  </div>
                  <div className="nowrap"
                    style={{
                      color: 'rgb(200,200,200)',
                    }}
                  >
                    {
                      artistsReducer(currentSong.artists)
                    }
                  </div>
                </>
              )
            }
          </Col>
          <Col span={4}>
            {
              currentSong &&
              <img src={logos[currentSong.platform]} alt={currentSong.platform} />
            }
          </Col>
          <Col span={3}>
            <Button
              ghost
              shape="circle"
              icon={
                getSongSourceStatus === 'notYet'
                ? <CaretRightOutlined />
                : (
                  getSongSourceStatus === 'started'
                  ? <LoadingOutlined />
                  : (
                    getSongSourceStatus === 'ok'
                    ? (
                      songLoaded
                      ? (
                        playerStatus === 'playing'
                        ? <PauseOutlined />
                        : <CaretRightOutlined />
                      )
                      : <LoadingOutlined />
                    )
                    : <CaretRightOutlined />
                  )
                )
              }
              onClick={this.onCentralBtnClick}
              disabled={!currentSong}
            />
          </Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button
              ghost
              icon={<UnorderedListOutlined />}
              onClick={this.onPlayingListBtnClick}
            />
          </Col>
        </Row>
        {
          <PlayingList visible={this.state.playingListVisible} />
        }
      </div>
    );
  }
}

const logos = {
  qq: qqMusicLogo,
  netease: neteaseMusicLogo,
  kuwo: kuwoMusicLogo,
};

function mapStateToProps(state) {
  const currentSong = state.playingList[state.playIndex];
  return {
    currentSong: currentSong,
    playingList: state.playingList,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    changePlayIndex: (currentSong, playingList, playMode, direction) => {
      let nextPlayIndex;
      const currentIndex = playingList.findIndex(song =>
        song.newId === currentSong.newId);
      if (playMode === 'loop') {
        if (direction === 'forward') {
          nextPlayIndex = playingList[currentIndex + 1] ? currentIndex + 1 : 0;
        } else if (direction === 'backward') {
          nextPlayIndex = playingList[currentIndex - 1] ? currentIndex - 1 :
            playingList.length - 1;
        }
      } else if (playMode === 'shuffle') {
        do {
          nextPlayIndex = Math.floor(Math.random() * playingList.length);
        } while (nextPlayIndex === currentIndex);
      }
      if (nextPlayIndex !== undefined) {
        dispatch({ type: 'UPDATE_PLAY_INDEX', data: nextPlayIndex });
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);