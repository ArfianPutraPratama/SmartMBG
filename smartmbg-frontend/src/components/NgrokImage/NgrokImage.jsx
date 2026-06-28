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
      let retries = 3;
      const fetchImage = (attempt) => {
        // Add artificial delay for concurrent requests (jitter) to prevent overwhelming php artisan serve
        const delay = attempt === 1 ? Math.random() * 200 : Math.pow(2, attempt) * 200 + (Math.random() * 100);
        
        setTimeout(() => {
          fetch(src, { headers: { 'ngrok-skip-browser-warning': '69420' } })
            .then(response => {
              if (!response.ok) throw new Error('Network response was not ok');
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('text/html')) {
                 throw new Error('Ngrok returned HTML instead of image');
              }
              return response.blob();
            })
            .then(blob => {
              setImgSrc(URL.createObjectURL(blob));
              setLoading(false);
            })
            .catch(error => {
              console.warn(`Error fetching image (attempt ${attempt}):`, error);
              if (attempt < retries) {
                fetchImage(attempt + 1);
              } else {
                console.error("Max retries reached for image:", src);
                setImgSrc(src); // Fallback to direct src
                setLoading(false);
              }
            });
        }, attempt === 1 ? 0 : delay);
      };
      
      fetchImage(1);
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
