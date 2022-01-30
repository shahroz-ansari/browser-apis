import { FC } from 'react';
import { Link } from 'react-router-dom';
import ExternalLinkIcon from '../core/svgs/ExternalLink';

const Home: FC<object> = () => (
  <div className="flex flex-col bg-slate-200 min-h-screen">
    <h1 className=" text-2xl border-b self-center">Browser APIs Demo</h1>
    <ul className="p-2 m-2">
      <li className="border-b py-2">
        <Link to="/contact-picker" className="flex items-center">
          Contact Picker API <ExternalLinkIcon width="18px" height="18px" />
        </Link>
      </li>
      <li className="border-b py-2">
        <Link to="/geolocation" className="flex items-center">
          Geolocation API <ExternalLinkIcon width="18px" height="18px" />
        </Link>
      </li>
    </ul>
  </div>
);

export default Home;
