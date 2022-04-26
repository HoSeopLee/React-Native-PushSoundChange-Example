/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const getToken = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const token = await messaging().getToken();
      console.log('asdfasdf ??? ', token);

      return token;
    }
  };

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    // NOT using push notifications from the server right now, this step is not done.
    onRegister: function (token) {},

    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('notification?.sound :::  ', notification?.sound);
      showNotification('Test', `Test.`, '0', true, Number(notification?.sound));
      // required on iOS only
      if (Platform.OS == 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NewData);
      }
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    //senderID: "YOUR GCM (OR FCM) SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: Platform.OS === 'ios',
  });

  function showNotification(
    title,
    message,
    id,
    vibrate,
    sound,
    ongoing = false,
  ) {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId:
        sound === 1 ? 'channelname' : sound === 2 ? 'channelname2' : '',
      id: id,
      autoCancel: true,
      vibrate: vibrate,
      vibration: vibrate ? 300 : undefined,
      priority: 'high',
      visibility: 'public',
      importance: 'high',
      ongoing: ongoing,
      allowWhileIdle: false,

      /* iOS only properties */
      //alertAction: 'view',
      userInfo: {id: id, routineId: 1}, // required for ios local notification

      /* iOS and Android properties */
      title: title,
      message: message, // (required)
      playSound: true,
      soundName: sound === 1 ? 'bingo' : sound === 2 ? 'sms' : 'default',
      // number: number // silly library, iOS requires number, while android string...
    });
  }
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'channelname', // (required)
        channelName: 'channelname', // (required)
        playSound: true, // (optional) default: true
        soundName: 'bingo', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'channelname2', // (required)
        channelName: 'channelname2', // (required)
        playSound: true, // (optional) default: true
        soundName: 'sms', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    getToken();

    //백그라운드
    messaging().onNotificationOpenedApp(async remoteMessage => {
      setTimeout(async () => {
        console.log('remoteMessage :: ', remoteMessage);
        // Push_Function(remoteMessage?.data, navigation, userInfo);
      }, 1000);
    });
    //포그라운드
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('remoteMessage :: ', remoteMessage);
        // setTimeout(async () => {
        //   Push_Function(remoteMessage?.data, navigation, userInfo);
        // });
      }, 1000);
  }, []);

  //i
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
