import { format } from 'date-fns';
import { Image, Tag } from 'antd';

import './Card.css';

function reduceDescription(text) {
  return text.replace(/^(.{150}[^\W]*).*/gm, '$1...');
}

export default function Card(props) {
  const { data } = props;
  const { title, posterPath, overview } = data;
  let { releaseDate } = data;

  try {
    releaseDate = format(new Date(releaseDate), 'PP');
  } catch {
    releaseDate = 'The date is missing';
  }

  const reducedOverview = reduceDescription(overview);

  return (
    <li className="card">
      <Image
        height={350}
        className="poster-img"
        alt={title}
        src={`https://image.tmdb.org/t/p/original${posterPath}`}
        placeholder
        fallback="https://grinberggallery.com/wp-content/uploads/2017/07/image.png"
      />
      <div className="movie-info">
        <h2 className="title">{title}</h2>
        <span className="date">{releaseDate}</span>
        <div className="tags">
          <Tag>Action</Tag>
          <Tag>Drama</Tag>
        </div>
        <p className="description">{reducedOverview}</p>
      </div>
    </li>
  );
}
