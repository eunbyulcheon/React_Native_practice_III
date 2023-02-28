import React, { useEffect, useState } from 'react';
import Realm from 'realm';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './navigator';
import { DBContext } from './context';
import { setTestDeviceIDAsync } from 'expo-ads-admob';

const FeelingSchema = {
	name: 'Feeling',
	properties: {
		_id: 'int',
		emotion: 'string',
		message: 'string',
	},
	primaryKey: '_id',
};

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);
	const [realm, setRealm] = useState(null);

	useEffect(() => {
		async function prepare() {
			try {
				await setTestDeviceIDAsync('EMULATOR');
				await SplashScreen.preventAutoHideAsync();
				const connection = await Realm.open({
					path: 'JournalDB',
					schema: [FeelingSchema],
				});
				setRealm(connection);
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
				await SplashScreen.hideAsync();
			}
		}

		prepare();
	}, []);

	if (!appIsReady) {
		return null;
	}

	return (
		<DBContext.Provider value={realm}>
			<NavigationContainer>
				<Navigator />
			</NavigationContainer>
		</DBContext.Provider>
	);
}
