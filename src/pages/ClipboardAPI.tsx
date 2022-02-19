import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '../core/Button';
import ExternalLinkIcon from '../core/svgs/ExternalLink';
import { print } from '../utilities/logs';
import logo from '../assets/images/logo192.png';

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const bb = new Blob([ab], { type: 'image/png' });
  return bb;
}

const ClipboardAPI: FC<object> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clipboard: any = window.navigator?.clipboard;
  if (clipboard) print('Clipboard Available');

  const imageRef = useRef(null);
  const editableRef: any = useRef(null);
  const [text, setText] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [extImages, setExtImages] = useState<any[]>([]);

  const copyText = useCallback(
    async (textToCopy: string) => {
      await clipboard.writeText(textToCopy);
    },
    [clipboard],
  );

  const copySelectedText = useCallback(async () => {
    const t = window.getSelection();
    if (!t?.toString()) {
      alert('Nothing is selected');
      return;
    }
    copyText(t?.toString());
  }, [copyText]);

  const copyImage = useCallback(async () => {
    const imageBlob = dataURItoBlob(logo);
    await clipboard.write([new ClipboardItem({ [imageBlob.type]: imageBlob })]);
  }, [clipboard]);

  const pasteText = useCallback(async () => {
    const loadImage = async (item: ClipboardItem, type: string): Promise<any> => {
      const blob = await item.getType(type);
      const str = URL.createObjectURL(blob);
      setImages((i) => i.concat(str));
    };
    const loadText = async (item: ClipboardItem, type: string): Promise<any> => {
      const blob = await item.getType(type);
      const str = await blob.text();
      setText((i) => i.concat(str));
    };

    const t = await clipboard.read();
    t.forEach((item: ClipboardItem) => {
      try {
        item.types?.forEach((type: string) => {
          if (type.startsWith('image')) {
            loadImage(item, type);
          } else if (type === 'text/plain') {
            // we can simply use clipboard.readText for text only
            loadText(item, type);
          } else {
            print(type, ': not supported');
          }
        });
      } catch (error) {
        print(error);
      }
    });
  }, [clipboard]);

  useEffect(() => {
    editableRef.current.innerHTML = 'Paste you content here...';
  }, [extImages]);

  useEffect(() => {
    const handlePaste = (event: any): void => {
      const { clipboardData } = event;
      const loadFile = async (file: any): Promise<any> => {
        const reader = new FileReader();
        reader.onload = function loader(evt) {
          setExtImages((p) => p.concat({ url: evt.target?.result, name: file.name }));
        };
        reader.readAsDataURL(file);
      };

      Array.prototype.forEach.call(clipboardData.types, (type, i) => {
        loadFile(clipboardData.items[i].getAsFile());
      });
    };
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  });

  return (
    <div className="m-2">
      <div className="flex border-b mb-3 pb-3">
        <h1 className="text-2xl">Copy to clipboard</h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API" rel="noreferrer" target="_blank">
          <ExternalLinkIcon />
        </a>
      </div>
      <div className="border border-gray-500 p-3">
        <div className="">
          <Button onClick={() => copyText('Copy Me!')}>Copy Me!</Button>
          <Button onClick={copySelectedText} className="border-blue-800 bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 ml-2">
            Copy Selected Text
          </Button>
          <div className="mt-2">
            <Button onClick={copyImage}>Copy this image</Button>
            <img src={logo} alt="clipboard" className="mt-2" ref={imageRef} />
          </div>
        </div>
      </div>

      <div className="border my-2 p-2 h-[150px] w-full flex">
        <div>
          <Button onClick={pasteText}>Paste</Button>
        </div>
        {text.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
        {images.map((item, index) => (
          <img key={index} src={item} alt="preview" className="h-[100px] w-[100px]" />
        ))}
      </div>
      <div ref={editableRef} contentEditable className="h-[50px] w-[300px] border border-red-200" />
      <div>
        {extImages?.map((t, i) => (
          <div key={i}>
            <div>{t.name}</div>
            <img src={t.url} alt="preview" className="h-[100px] w-[100px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClipboardAPI;
