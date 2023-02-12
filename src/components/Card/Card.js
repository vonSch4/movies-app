import { format } from 'date-fns';
import { Image, Rate, Tag } from 'antd';

import './Card.css';

function reduceDescription(text) {
  return text.replace(/^(.{140}[^\W]*).*/gm, '$1...');
}

export default function Card({ data, genresList, putGuestRating }) {
  const { id, title, posterPath, overview, genreId, avgRating, userRating } =
    data;
  let { releaseDate } = data;
  let border;

  const backupImg =
    'https://grinberggallery.com/wp-content/uploads/2017/07/image.png';

  try {
    releaseDate = format(new Date(releaseDate), 'PP');
  } catch {
    releaseDate = 'The date is missing';
  }

  const reducedOverview = reduceDescription(overview);

  if (avgRating <= 3) border = '3px solid #E90000';
  if (avgRating > 3 && avgRating <= 5) border = '3px solid #E97E00';
  if (avgRating > 5 && avgRating <= 7) border = '3px solid #E9D100';
  if (avgRating > 7) border = '3px solid #66E900';

  const genresTags = genreId.map((el) => {
    return <Tag key={el}>{genresList[el]}</Tag>;
  });

  return (
    <li className="card">
      <Image
        height={350}
        className="poster-img"
        alt={title}
        src={posterPath}
        placeholder
        fallback={backupImg}
      />
      <div className="movie-info">
        <div className="title">
          <h2 className="title-text">{title}</h2>
          <span className="title-rating" style={{ border }}>
            {avgRating}
          </span>
        </div>
        <span className="date">{releaseDate}</span>
        <div className="tags">{genresTags}</div>
        <p className="description">{reducedOverview}</p>
        <Rate
          className="rate"
          count={10}
          allowHalf
          style={{ display: 'flex', flexWrap: 'nowrap' }}
          defaultValue={userRating}
          onChange={(value) => putGuestRating(id, value)}
        />
      </div>
    </li>
  );
}
