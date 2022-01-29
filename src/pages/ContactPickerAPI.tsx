import { FC, useCallback, useMemo, useRef, useState } from 'react';
import Button from '../core/Button';
import CheckIcon from '../core/svgs/Check';
import ExternalLinkIcon from '../core/svgs/ExternalLink';
import { print } from '../utilities/logs';
import { capitalizeFirstLetter } from '../utilities/stringManipulation';

const ContactPickerAPI: FC<object> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigatorOnWindow: any = window.navigator;

  const supported = useRef('contacts' in navigator);
  const [supportedProperties, setSupportedProperties] = useState<string[]>([]);
  const [options, setOptions] = useState<{ [key: string]: boolean }>({
    email: false,
    name: false,
    tel: true,
    icon: false,
    address: false,
    multiple: false,
  });
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [contacts, setContacts] = useState<UserContact[] | null>(null);
  const contactProps: string[] = useMemo(() => ['email', 'name', 'icon', 'tel', 'address'], []);

  useMemo(async () => {
    let value: string[] = [];
    if (supported.current) {
      try {
        value = await navigatorOnWindow.contacts.getProperties();
      } catch (error) {
        print('Contact Picker::navigatorOnwindow.contacts.getProperties()', error);
      }
    }
    setSupportedProperties(value);
  }, [supported, navigatorOnWindow]);

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const { checked } = event.target;

    setOptions((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const accessPhoneBook = useCallback(async () => {
    if (supported.current) {
      const props = contactProps.filter((item) => options[item]);
      if (props.length === 0) {
        // eslint-disable-next-line no-alert
        alert('Please select atleast one property to access.');
      }
      try {
        const result = await navigatorOnWindow.contacts.select(
          contactProps.filter((item) => options[item]),
          { multiple: options.multiple },
        );
        setContacts(result);
      } catch (error) {
        print('Contact Picker::navigatorOnwindow.contacts.select()', error);
      }
    }
  }, [contactProps, navigatorOnWindow.contacts, options]);

  return (
    <div className="m-2">
      <div className="flex">
        <h1 className="text-2xl">Contact Picker API</h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API" rel="noreferrer" target="_blank">
          <ExternalLinkIcon />
        </a>
      </div>
      {supported.current ? (
        <div>
          <div className="flex flex-col rounded border my-3 p-3 border-gray-600">
            <div>
              <h3 className="text-lg font-semibold">Supported Properties</h3>
              <div className="flex w-full flex-row">
                <p className="rounded px-2 py-1 mx-1">
                  Email
                  {supportedProperties.includes('email') && <CheckIcon height="25px" width="25px" />}
                </p>
                <p className="rounded px-2 py-1 mx-1">
                  Name {supportedProperties.includes('name') && <CheckIcon height="25px" width="25px" />}
                </p>
                <p className="rounded px-2 py-1 mx-1">
                  Tel {supportedProperties.includes('tel') && <CheckIcon height="25px" width="25px" />}
                </p>
                <p className="rounded px-2 py-1 mx-1">
                  Icon {supportedProperties.includes('icon') && <CheckIcon height="25px" width="25px" />}
                </p>
                <p className="rounded px-2 py-1 mx-1">
                  Address {supportedProperties.includes('address') && <CheckIcon height="25px" width="25px" />}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Choose Properties</h3>
              <div className="flex w-full flex-col">
                {contactProps.map((item: string) => (
                  <p key={item} className="rounded px-2 py-1 mx-1">
                    <label htmlFor={item}>
                      <input type="checkbox" id={item} name={item} checked={options[item]} onChange={handleCheckboxChange} />
                      <span className="mx-2">{capitalizeFirstLetter(item)}</span>
                    </label>
                  </p>
                ))}
              </div>
              <label htmlFor="multiple" className="mx-3">
                <input type="checkbox" id="multiple" name="multiple" checked={options.multiple} onChange={handleCheckboxChange} />
                <span className="mx-2">{capitalizeFirstLetter('multiple')}</span>
              </label>
            </div>
            <div className="mt-2">
              <Button onClick={accessPhoneBook}>Access Phonebook</Button>
            </div>
          </div>
          {contacts?.length ? (
            <div className="flex flex-col">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">Result</h3>
                {showRawJson ? (
                  <Button onClick={() => setShowRawJson(false)}>Show Contact Card</Button>
                ) : (
                  <Button onClick={() => setShowRawJson(true)}>Show Raw Json</Button>
                )}
              </div>

              {showRawJson ? (
                <div className="border p-3 my-2">{JSON.stringify(contacts)}</div>
              ) : (
                <div className="border p-3 my-2">
                  {contacts?.map((contact, index) => (
                    <div key={index} className="flex border-b flex-col py-2">
                      <p className="font-semibold text-xl">{contact?.name?.join(' ')}</p>
                      {contact?.tel?.length ? <span className="font-semibold">Mobile:</span> : null}
                      {contact?.tel?.map((tel, i) => (
                        <p key={i}>{tel}</p>
                      ))}
                      {contact?.email?.length ? <span className="font-semibold">Email:</span> : null}
                      {contact?.email?.map((email, i) => (
                        <p key={i}>{email}</p>
                      ))}
                      {contact?.address?.length ? <span className="font-semibold">Address:</span> : null}
                      {contact?.address?.map((address, i) => (
                        <p key={i}>{address}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded border border-orange-600 my-3 p-3">
          <h3 className="text-lg text-orange-600 font-bold">Not Supported</h3>
          <p className="text-orange-600">The Contact Picker API is not supported in this browser.</p>
        </div>
      )}
    </div>
  );
};

interface UserContact {
  email?: string[];
  name?: string[];
  icon?: unknown[];
  tel?: string[];
  address?: string[];
}

export default ContactPickerAPI;
