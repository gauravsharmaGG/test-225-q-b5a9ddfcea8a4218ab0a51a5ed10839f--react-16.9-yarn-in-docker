import React, { useState } from 'react';
// import { segmentOptions } from '../../helpers/constants';
import { validURL } from '../../helpers/helperfunction';
import axios from 'axios';
import Video from '../../helpers/Video';
import './index.scss';

const Segment = (props) => {
  const [segmentedVideos, setSegmentedVideos] = useState([]);
  const [videoLink, setVideoLink] = useState(false);
  const [segmentSettings, setSegmentedSettings] = useState(false);
  const [intervalDuration, setIntervalDuration] = useState(false);

  const onSegmentVideo = (e) => {
      e.preventDefault();
    if (
      validURL(videoLink) &&
      segmentSettings &&
      !!intervalDuration &&
      !isNaN(intervalDuration)
    ) {
      setSegmentedVideos([]);
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/process-interval`, {
          video_link: videoLink,
          interval_duration: Number(intervalDuration),
        })
        .then((res) => {
          //   console.log(res);
          //   console.log(res.data.interval_videos);
          if (res.data) {
            setSegmentedVideos(res.data.interval_videos);
          }
        });
    }
  };
  return (
    <>
    <header className="App-header">
        Segment Video
      </header>
      <div className='container segment-container'>
        <form>
          <div className='mb-3'>
            <label htmlFor='video-link' className='form-label'>
              Video Link...
            </label>
            <input
              className='form-control video-link'
              id='video-link'
              aria-describedby='videoLink'
              onChange={(e) => setVideoLink(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='video-link' className='form-label'>
              Select Segment settings...
            </label>
            <select
              className='form-select segment-setting'
              aria-label='Select Segment settings...'
              onChange={(e) => setSegmentedSettings(e.target.value)}
            >
              <option value={false} defaultValue>
                Select Segment settings...
              </option>
              <option value={'Interval Duration'}>Interval Duration</option>
            </select>
          </div>
          {segmentSettings && (
            <div className='mb-3'>
              <label htmlFor='interval-duration' className='form-label'>
                Interval Duration (in seconds)...
              </label>
              <input
                className='form-control interval-duration'
                id='interval-duration'
                type='number'
                aria-describedby='interval-duration'
                onChange={(e) => setIntervalDuration(e.target.value)}
              />
            </div>
          )}
          <button
            className='btn btn-danger process-video pink-500'
            onClick={onSegmentVideo}
            disabled={
              !(
                validURL(videoLink) &&
                segmentSettings &&
                !!intervalDuration &&
                !isNaN(intervalDuration) &&
                Number(intervalDuration) > 0
              )
            }
          >
            SEGMENT VIDEO
          </button>
        </form>

        {segmentedVideos && (
          <>
            <hr />
            <div className='row'>
              {segmentedVideos.map((url, index) => (
                <div className='col-md-4'>
                  <Video url={url.video_url} index={index + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Segment;
