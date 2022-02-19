import { FC } from 'react';
import { Link } from 'react-router-dom';
import ExternalLinkIcon from '../core/svgs/ExternalLink';

const Home: FC<object> = () => {
  const list = [
    {
      path: '/contact-picker',
      name: 'Contact Picker API',
    },
    {
      path: '/geolocation',
      name: 'Geolocation API',
    },
    {
      path: '/drag-drop',
      name: 'Drag Drop API',
    },
    {
      path: '/clipboard',
      name: 'Copy to Clipboard API',
    },
  ];
  return (
    <div className="flex flex-col bg-slate-200 min-h-screen">
      <h1 className=" text-2xl border-b self-center">Browser APIs Demo</h1>
      <ul className="p-2 m-2">
        {list.map((item) => (
          <li className="border-b py-2" key={item.path}>
            <Link to={item.path} className="flex items-center">
              {item.name} <ExternalLinkIcon width="18px" height="18px" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
