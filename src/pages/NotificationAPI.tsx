import { FC, useCallback, useEffect, useState } from 'react';
import Button from '../core/Button';
import ExternalLinkIcon from '../core/svgs/ExternalLink';
import img2 from '../assets/images/img2.jpg';

const checkNotificationPromise = (): boolean => {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
};

const NotificationAPI: FC<object> = () => {
  const [permission, setPermission] = useState(Notification?.permission);
  const [naction, setNAction] = useState({
    action: '',
    data: '',
  });
  const [options, setOptions] = useState({
    // actions: [{ action: 'Okay', title: 'Fine' }],
    body: 'This is body text.',
    icon: img2,
    badge: 'https://picsum.photos/200',
    data: 'Data in notification',
    tag: 'n1',
    renotify: false,
  });

  useEffect(() => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then((_permission) => {
        setPermission(permission);
      });
    } else {
      Notification.requestPermission((_permission) => {
        setPermission(permission);
      });
    }
  }, [permission]);

  const handleNotify = useCallback(() => {
    if (permission !== 'denied') {
      // eslint-disable-next-line no-new
      const n = new Notification('New Message', options);
      n.onclick = function f1(event) {
        setNAction({ action: 'click', data: (event.currentTarget as Notification)?.data });
        n.close();
      };
      n.onclose = function f2(event) {
        setNAction({ action: 'close', data: (event.currentTarget as Notification)?.data });
      };
      n.onshow = function f3(event) {
        setNAction({ action: 'show', data: (event.currentTarget as Notification)?.data });
      };
    }
  }, [permission, options]);

  return (
    <div className="m-2">
      <div className="flex border-b mb-3 pb-3">
        <h1 className="text-2xl">Notofication API</h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/notification" rel="noreferrer" target="_blank">
          <ExternalLinkIcon />
        </a>
      </div>
      <Button onClick={handleNotify}>Notify Me!</Button>
      <div className="m-2">
        Notification Current Permission:{' '}
        <span className={`${permission === 'granted' ? 'text-green-600' : 'text-red-600'}`}>{permission || ''}</span>
      </div>
      <div className="m-2">
        Notification Max Actions: <span>{(Notification as any)?.maxActions}</span>
      </div>
      <div className="m-2">
        Body:
        <input
          type="text"
          className="border p-2"
          value={options.body}
          onChange={(event) => setOptions((p) => ({ ...p, body: event.target.value }))}
        />
      </div>
      <div className="m-2">
        Icon:
        <input
          type="checkbox"
          className="border p-2"
          checked={!!options.icon}
          onChange={(event) => setOptions((p) => ({ ...p, icon: event.target.checked ? img2 : '' }))}
        />
      </div>
      <div className="m-2">
        Data:
        <input
          type="text"
          className="border p-2"
          value={options.data}
          onChange={(event) => setOptions((p) => ({ ...p, data: event.target.value }))}
        />
      </div>
      <div className="m-2">
        tag: (only one notification per tag)
        <input
          type="text"
          className="border p-2"
          value={options.tag}
          onChange={(event) => setOptions((p) => ({ ...p, tag: event.target.value }))}
        />
      </div>
      <div className="m-2">
        renotify: (for same tag)
        <input
          type="checkbox"
          className="border p-2"
          checked={options.renotify}
          onChange={(event) => setOptions((p) => ({ ...p, renotify: event.target.checked }))}
        />
      </div>
      <div className="border p-2">
        Action: {naction.action} || Data: {naction.data}
      </div>
    </div>
  );
};

export default NotificationAPI;
