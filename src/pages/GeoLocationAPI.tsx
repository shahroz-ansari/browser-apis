import { FC, useCallback, useRef, useState } from 'react';
import Button from '../core/Button';
import ExternalLinkIcon from '../core/svgs/ExternalLink';
import { print } from '../utilities/logs';

const GeoLocationAPI: FC<object> = () => {
  const supported = useRef('geolocation' in navigator);

  const [locating, setLocating] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  const [watchOptions, setWatchOptions] = useState<WatchOptions>({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });
  const [watchedLocations, setWatchedLocations] = useState<Location[]>([]);
  const [clearWatchedLocations, setClearWatchedLocations] = useState<number | null>(null);

  const accessMyLocation = useCallback(() => {
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        print('Error getting geolocation', error);
        setLocating(false);
        setLocationError(error.message);
      },
    );
  }, []);
  const watchMyLocation = useCallback(() => {
    setLocating(true);
    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocating(false);
        setWatchedLocations((prev) => {
          const locations = [...prev];
          locations.unshift({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          return locations;
        });
      },
      (error) => {
        print('Error getting geolocation');
        setLocationError(error.message);
      },
      watchOptions,
    );

    setClearWatchedLocations(id);
  }, [watchOptions]);

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const { checked } = event.target;

    setWatchOptions((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handlevalueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const { value } = event.target;

    setWatchOptions((prev) => ({ ...prev, [name]: value }));
  }, []);

  const stopWatching = useCallback(() => {
    if (clearWatchedLocations !== null) {
      navigator.geolocation.clearWatch(clearWatchedLocations);
      setClearWatchedLocations(null);
    }
  }, [clearWatchedLocations]);

  const clearResults = useCallback(() => {
    setLocation(null);
    setWatchedLocations([]);
  }, []);

  return (
    <div className="m-2">
      <div className="flex border-b">
        <h1 className="text-2xl">Geolocation API</h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API" rel="noreferrer" target="_blank">
          <ExternalLinkIcon />
        </a>
      </div>
      {supported.current ? (
        <div className="flex my-4 flex-col">
          <div className="flex flex-col my-3">
            <p className="font-semibold">Watch Options</p>
            <label htmlFor="enableHighAccuracy">
              <input
                type="checkbox"
                id="enableHighAccuracy"
                name="enableHighAccuracy"
                checked={watchOptions.enableHighAccuracy}
                onChange={handleCheckboxChange}
              />
              <span className="mx-2">Enable High Accuracy</span>
            </label>
            <label htmlFor="timeout">
              <span className="mx-2">Timeout</span>
              <input
                type="number"
                id="timeout"
                name="timeout"
                className="border p-1"
                value={watchOptions.timeout}
                onChange={handlevalueChange}
              />
            </label>
            <label htmlFor="maximumAge">
              <span className="mx-2">Maximum Age</span>
              <input
                type="number"
                id="maximumAge"
                name="maximumAge"
                className="border p-1"
                value={watchOptions.maximumAge}
                onChange={handlevalueChange}
              />
            </label>
          </div>
          <div className="flex w-full mx-auto justify-between">
            <Button onClick={accessMyLocation}>Access My Location</Button>
            {clearWatchedLocations !== null ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div role="button" tabIndex={0} onClick={stopWatching} className="font-semibold text-red-500">
                Stop watching
              </div>
            ) : (
              <Button onClick={watchMyLocation}>Watch My Location</Button>
            )}
          </div>
          {location || watchedLocations.length ? (
            <div className="font-semibold mt-4">
              Results
              <span
                role="button"
                tabIndex={0}
                onClick={clearResults}
                onKeyPress={clearResults}
                className="ml-2 text-red-500 text-sm"
              >
                Clear
              </span>
            </div>
          ) : null}
          {locating ? <div className="flex border my-4 flex-col p-3">Locating...</div> : null}
          {locationError ? <div className="flex border my-4 flex-col p-3 text-red-500">{locationError}</div> : null}
          {location ? (
            <div className="flex border my-4 flex-col p-3">
              <p>
                <span className="font-semibold">Latitude:</span>
                {location?.latitude}
              </p>
              <p>
                <span className="font-semibold">Longitude:</span>
                {location?.longitude}
              </p>
              <a
                href={`https://www.openstreetmap.org/#map=18/${location?.latitude}/${location?.longitude}`}
                rel="noreferrer"
                target="_blank"
                className="text-blue-500 my-2 flex items-center"
              >
                Locate me on map <ExternalLinkIcon height="16px" width="16px" />
              </a>
            </div>
          ) : null}
          {watchedLocations.length ? (
            <div className="flex border my-4 p-3 flex-col">
              {watchedLocations.map((position, index) => (
                <div className="border-b flex flex-col" key={`${position?.latitude}${position?.longitude}${index}`}>
                  <p className="">
                    <span className="font-semibold">Latitude: </span>
                    {position?.latitude}
                  </p>
                  <p>
                    <span className="font-semibold">Longitude: </span>
                    {position?.longitude}
                  </p>
                  <p>
                    <span className="font-semibold">Accuracy: </span>
                    {position?.accuracy}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded border border-orange-600 my-3 p-3">
          <h3 className="text-lg text-orange-600 font-bold">Not Supported</h3>
          <p className="text-orange-600">The Geolocation API is not supported in this browser.</p>
        </div>
      )}
    </div>
  );
};

interface Location {
  longitude: number;
  latitude: number;
  accuracy?: number;
}

interface WatchOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}
export default GeoLocationAPI;
