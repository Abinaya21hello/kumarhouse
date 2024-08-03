import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={`full-${index}`} />
      ))}
      {halfStar === 1 && <StarHalfIcon />}
      {[...Array(emptyStars)].map((_, index) => (
        <StarBorderIcon key={`empty-${index}`} />
      ))}
    </div>
  );
};

export default StarRating;
