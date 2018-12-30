// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
    const jabra = require('jabra')('xxxxxxxx')
    console.log(jabra)
    jabra.on('attach', (device) => {
      device.on('btnPress', (BTN_TYPE, btnValue) => {
          console.log('New input from device is received: ', jabra.enums.enumDeviceBtnType[BTN_TYPE], btnValue);
      })

      device.isRingerSupportedAsync() // returns promise
          .then((isSupported) => {
              if (isSupported) {
                  device.ringAsync() // returns promise
                      .then(() => {
                          console.log('Device starts ringing');
                          setTimeout(() => {
                              device.unringAsync() // returns promise
                                  .then(() => {
                                      console.log('Device stops ringing');
                                  })
                                  .catch((error) => {
                                      console.log('Device did not stop ringing due to ', error);
                                  })
                          }, 5000); // stop ringing the device after 5 second
                      })
                      .catch((error) => {
                          console.log('Device did not start ringing due to ', error);
                      })
              }
          })
          .catch((error) => {
              console.log(error);
          })
  });

  jabra.on('detach', (deviceID, deviceName, productID, vendorID, ESN, isDongleDevice, isInFirmwareUpdateMode, variant, errorStatus) => {
      console.log('Device detached with deviceID:', deviceID);
  });
  }
  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}
