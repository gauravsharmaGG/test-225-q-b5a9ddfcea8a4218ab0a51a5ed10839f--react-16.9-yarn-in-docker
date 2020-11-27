import React from 'react';

const Video = (props) => {
  const { url, index } = props;
  return (
    <video  className={`segmented-video-${index}`} controls>
      <source src={url} type='video/mp4' className={`segmented-video-source-${index}`} />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
