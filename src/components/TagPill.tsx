import { Link } from 'react-router-dom';
import { Tag } from '../types/api';

interface Props {
  tag: Tag;
}

export const TagPill = ({ tag }: Props) => (
  <Link
    to={`/tags/${tag.slug}`}
    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-100"
  >
    #{tag.name}
  </Link>
);
