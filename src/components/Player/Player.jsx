import './Player.scss';
import { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import useInterval from '../../hooks/useInterval';

const VIDEO_STATE = {
    pause: 'pause',
    play: 'play',
}

export function Player () {
  const [videoState, setVideoState] = useState('pause');
  const [playbackTime,setPlaybackTime] = useState(0);
  const [duration,setDuration] = useState(0);
  const videoElement = useRef(0);
  const fillBar = useRef(0);

  useInterval(()=>{
      setPlaybackTime(videoElement.current.currentTime);
      shiftTimeline(((playbackTime/duration) * 100).toFixed(2));
  }, videoState == VIDEO_STATE.play ? 1000 : null);

  function updateMetaData() {
    videoElement.current.muted = false;
    setDuration(videoElement.current.duration);
  }

  function changeVideoState() {
    setVideoState((prevState) => {
        switch(prevState) {
        case VIDEO_STATE.pause:
          videoElement.current.play();
          setDuration(videoElement.current.duration);
          return VIDEO_STATE.play;
          case VIDEO_STATE.play:
            videoElement.current.pause();
            return VIDEO_STATE.pause;
        default:
            break;
        }
    })
  }

  function changeCurrentTime(e) {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let elementWidth = e.currentTarget.offsetWidth;
    let percentage = (x / elementWidth) * 100;
    videoElement.current.currentTime = (duration * (percentage.toFixed(2) / 100));
    setPlaybackTime(videoElement.current.currentTime);
    shiftTimeline(percentage.toFixed(2));
  }

  function shiftTimeline(percentage) {
    fillBar.current.style.width = `${percentage}%`;
  }

  function handleSpacePress(e) {
    if(e.code === "Space") {
      changeVideoState()
    }
  }

  function getFormattedTime(currentTime, duration) {
    let formattedCurrent = new Date(currentTime * 1000).toISOString().substring(11, 19);
    let formattedDuration = '00:00:00';
    if(!isNaN(duration)) {
      formattedDuration = new Date(duration * 1000).toISOString().substring(11, 19)
    }
    return `${formattedCurrent}|${formattedDuration}`;
  }

  function trackMouse(e) {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    console.log(x);
    console.log(e.button);
  }

  return (
      <>
          <div
            className="player-container"
            onKeyDown={(e) => handleSpacePress(e)}
            tabIndex={"0"}
          >
              <video
                className='video'
                ref={videoElement}
                muted={true}
                onLoadedMetadata={(e) => updateMetaData(e)}
              >
                  <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <div className="controls-container">
                  <div
                      className={classnames("state-button",[`state-button-${videoState}`])}
                      onClick={() => changeVideoState()}
                  ></div>
                  <div className="video-time">
                    {getFormattedTime(playbackTime,duration)}
                  </div>
                  <div
                    onClick={changeCurrentTime}
                    onMouseMove={trackMouse}
                    className="timeline-bar">
                    <div ref={fillBar} className="fill-bar"></div>
                  </div>
              </div>
          </div>
      </>
  )
}