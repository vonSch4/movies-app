import { Image, Rate, Tag } from 'antd';

import { reduceDescription, formatDate, setBorderStyle } from '../../utils';
import backupImg from '../../assets/image.png';

import './Card.css';

export default function Card({ data, genresList, putGuestRating }) {
  const {
    id,
    title,
    posterPath,
    overview,
    genreId,
    avgRating,
    userRating,
    releaseDate,
  } = data;

  const formattedDate = formatDate(releaseDate);
  const reducedOverview = reduceDescription(overview);
  const border = setBorderStyle(avgRating);

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
        <span className="date">{formattedDate}</span>
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
