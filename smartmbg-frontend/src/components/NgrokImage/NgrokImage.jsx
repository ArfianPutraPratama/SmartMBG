import React, { useState, useEffect } from 'react';

const NgrokImage = ({ src, alt, style, className }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    if (src.includes('ngrok-free.app')) {
      // Fetch the image using our global fetch interceptor
      fetch(src)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob();
        })
        .then(blob => {
          setImgSrc(URL.createObjectURL(blob));
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching image:", error);
          setImgSrc(src); // Fallback to direct src
          setLoading(false);
        });
    } else {
      setImgSrc(src);
      setLoading(false);
    }

    // Cleanup object URL
    return () => {
      if (imgSrc && imgSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [src]);

  if (loading) {
    return <div style={{ ...style, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '0.8rem' }}>Memuat...</div>;
  }

  return <img src={imgSrc || 'https://via.placeholder.com/150'} alt={alt} style={style} className={className} />;
};

export default NgrokImage;
