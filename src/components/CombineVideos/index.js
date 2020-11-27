import React, { useState, useMemo } from 'react';
// import { segmentOptions } from '../../helpers/constants';
import { validURL } from '../../helpers/helperfunction';
import axios from 'axios';
import './index.scss';

const CombineVideos = (props) => {
  const [combinedVideo, setCombinedVideo] = useState(false);
  const [videos, setVideos] = useState([]);
  const [height, setHeight] = useState(false);
  const [width, setWidth] = useState(false);

  const setVideoLink = (value, index, type) => {
    const videoData = [...videos];
    const elem = videoData[index];
    if (type === 'url') elem.video_url = value;
    if (type === 'start') elem.start = value;
    if (type === 'end') elem.end = value;
    setVideos(videoData);
  };
  const addVideo = () => {
    const videoData = [...videos];
    videoData.push({
      video_url: '',
      start: '',
      end: '',
    });
    setVideos(videoData);
  };

  const deleteVideo = (index) => {
    const videoData = [...videos];
    videoData.splice(index, 1);
    setVideos(videoData);
  };

  const isValidCombine = useMemo(() => {
    if (
      !(
        width &&
        height &&
        Number(width) > 0 &&
        Number(height) > 0 &&
        videos.length > 0
      )
    )
      return false;
    let isValid = true;
    videos.forEach((video) => {
      if (!validURL(video.video_url)) isValid = false;
      if (!(video.start && Number(video.start) >= 0)) isValid = false;
      if (!(video.end && Number(video.end) > Number(video.start)))
        isValid = false;
    });
    return isValid;
  }, [videos, width, height]);

  const onCombineVideo = (e) => {
    e.preventDefault();
    if (isValidCombine) {
      setCombinedVideo(false);
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/combine-video`, {
          segments: videos.map((video) => {
            return {
              video_url: video.video_url,
              start: Number(video.start),
              end: Number(video.end),
            };
          }),
          width,
          height,
        })
        .then((res) => {
          //   console.log(res);
          //   console.log(res.data.interval_videos);
          if (res.data) {
            setCombinedVideo(res.data.video_url);
          }
        });
    }
  };

  return (
    <>
      <header className='App-header'>Combine Video</header>
      <div className='container segment-container'>
        <div className='row'>
          <div className='btn btn-danger add-video col-md-3' onClick={addVideo}>
            ADD VIDEO
          </div>
        </div>
        {videos.map((video, index) => (
          <div className='row mb-4 mt-2'>
            <div className='mb-3 col-md-6'>
              <label htmlFor='video-link' className='form-label'>
                Video Link...
              </label>
              <input
                className={`form-control combine-video-${index + 1}`}
                id='video-link'
                aria-describedby='videoLink'
                value={video.video_url}
                onChange={(e) => setVideoLink(e.target.value, index, 'url')}
              />
            </div>
            <div className='mb-3 col-md-2'>
              <label htmlFor='video-link' className='form-label'>
                Start at (in seconds)...
              </label>
              <input
                className={`form-control combine-video-range-duration-start-${
                  index + 1
                }`}
                id='video-link'
                type='number'
                value={video.start}
                aria-describedby='videoLink'
                onChange={(e) => setVideoLink(e.target.value, index, 'start')}
              />
            </div>
            <div className='mb-3 col-md-2'>
              <label htmlFor='video-link' className='form-label'>
                End at (in seconds)...
              </label>
              <input
                className={`form-control combine-video-range-duration-end-${
                  index + 1
                }`}
                id='video-link'
                type='number'
                value={video.end}
                aria-describedby='videoLink'
                onChange={(e) => setVideoLink(e.target.value, index, 'end')}
              />
            </div>
            <div className='pt-4 mt-1 col-md-2'>
              <button
                className={`btn btn-danger process-video pink-500 delete-combine-video-range-duration-${
                  index + 1
                }`}
                onClick={() => deleteVideo(index)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
        <div className='row'>
          <div className='mb-3 col-md-3'>
            <label htmlFor='video-height' className='form-label'>
              Video Height...
            </label>
            <input
              className={`form-control video-height`}
              id='video-height'
              type='number'
              value={height}
              aria-describedby='video-height'
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className='mb-3 col-md-3'>
            <label htmlFor='video-width' className='form-label'>
              Video Width...
            </label>
            <input
              className={`form-control video-width`}
              id='video-width'
              type='number'
              value={width}
              aria-describedby='video-width'
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
        </div>
        <div className='row mt-4 mb-4'>
          <button
            className='btn btn-danger combine-video col-md-3'
            disabled={!isValidCombine}
            onClick={onCombineVideo}
          >
            COMBINE VIDEO(S)
          </button>
        </div>

        {combinedVideo && (
          <>
            <hr />
            <div class='row'>
                <div className="col-md-3">
              <video className={`combined-video`} controls>
                <source
                  src={combinedVideo}
                  type='video/mp4'
                  className={`combined-video-source`}
                />
                Your browser does not support the video tag.
              </video>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CombineVideos;
