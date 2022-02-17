import React, { FC, useCallback, useMemo, useState } from 'react';
import ExternalLinkIcon from '../core/svgs/ExternalLink';
import logo from '../assets/images/logo192.png';
import { print } from '../utilities/logs';

const DragDrop: FC<object> = () => {
  const [items, setItems] = useState([]);
  const [customDragImage, setCustomDragImage] = useState(false);
  const onDragStarthandler = useCallback(
    (event, data) => {
      print('----drag start', data);
      event.dataTransfer.setData('uuxr', data);
      event.dataTransfer.setData('text/plain', data);
      // event.dataTransfer.setData(type, data);
      if (customDragImage) {
        const img = new Image();
        img.src = logo;
        event.dataTransfer.setDragImage(img, 10, 10);
      }
    },
    [customDragImage],
  );

  const handleDragEnterHandler = useCallback((event) => {
    print('----drag enter');
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDragOverHandler = useCallback((event) => {
    // print('----drag over');
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const onDragLeaveHandler = useCallback((event) => {
    print('----drag leave');
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const onDragEndHandler = useCallback((event) => {
    print('----drag ends');
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDropHandler = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const item = event.dataTransfer.getData('text/plain');
    print('----drag drop', event.dataTransfer);

    if (event.dataTransfer.files?.length) {
      const file = event.dataTransfer.files[0];
      const src = URL.createObjectURL(file);
      file.src = src;
      setItems((i) => i.concat(file));
    } else {
      setItems((i) => i.concat(item));
    }
  }, []);

  return (
    <div className="m-2">
      <div className="flex border-b">
        <h1 className="text-2xl">Drag Drop API</h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API" rel="noreferrer" target="_blank">
          <ExternalLinkIcon />
        </a>
      </div>
      <div className="p-3 flex flex-col">
        <label htmlFor="customDragImage">
          <input
            type="checkbox"
            checked={customDragImage}
            onChange={() => setCustomDragImage(!customDragImage)}
            id="customDragImage"
          />
          Use Custom Drag Image
        </label>
        <div>Drag any item and drop</div>
        <div className="flex flex-row border border-gray-600">
          <div className="flex">
            <div
              className="cursor-move border border-gray-400 m-2 p-2"
              draggable
              onDragStart={(event) => onDragStarthandler(event, 'DRAG ME')}
            >
              DRAG ME
            </div>
          </div>
          <div className="flex">
            <div
              className="cursor-move border border-gray-400 m-2 p-2"
              // default draggable
            >
              <img src="https://picsum.photos/200" alt="logo" />
            </div>
          </div>
          <div className="flex">
            <div
              className="cursor-move border border-gray-400 m-2 p-2"
              draggable
              onDrag={(event) => onDragStarthandler(event, 'https://picsum.photos/200')}
            >
              <a href="https://picsum.photos/200">Link</a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full h-48 bg-gray-300 p-3"
        onDrop={onDropHandler}
        onDragEnter={handleDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDragEnd={onDragEndHandler}
        onDragLeave={onDragLeaveHandler}
      >
        <div className="flex border-dashed border-2 border-gray-400 h-full align-middle content-center">
          <div className="inline-block text-3xl font-semibold text-gray-500">Drop here</div>
        </div>
      </div>
      <ul>
        {items.map((item: any, index) => (
          <li className="p-3 border">
            {item.src ? (
              <span className="flex border border-red m-2 p-2" key={`item-${index}`}>
                Name: {item.name}, Size: {item.size}, Preview: <img src={item.src} alt="preview" height="200px" width="200px" />
              </span>
            ) : (
              <span key={`item-${index}`}>{item}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DragDrop;
