import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDB } from '../context';
import { FlatList, LayoutAnimation, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import colors from '../colors';
import { AdMobBanner } from 'expo-ads-admob';

const Home = ({ navigation: { navigate } }) => {
	const realm = useDB();
	const [feelings, setFeelings] = useState([]);

	useEffect(() => {
		const feelings = realm.objects('Feeling');
		feelings.addListener((feelings) => {
			LayoutAnimation.spring();
			setFeelings(feelings.sorted('_id', true));
		});
		return () => {
			feelings.removeAllListeners();
		};
	}, []);

	const onPress = (id) => {
		realm.write(() => {
			const feeling = realm.objectForPrimaryKey('Feeling', id);
			realm.delete(feeling);
		});
	};

	return (
		<View>
			<Title>My Journal</Title>
			<AdMobBanner
				bannerSize="largeBanner"
				adUnitID="ca-app-pub-3940256099942544/2934735716"
			/>

			<FlatList
				style={{ width: '100%' }}
				data={feelings.map((x) => x)}
				keyExtractor={(item) => item._id + ''}
				contentContainerStyle={{ paddingVertical: 30 }}
				ItemSeparatorComponent={Separator}
				renderItem={({ item }) => (
					<TouchableOpacity
						key={item._id + ''}
						onPress={() => onPress(item._id)}
					>
						<Record>
							<Emotion>{item.emotion}</Emotion>
							<Message>{item.message}</Message>
						</Record>
					</TouchableOpacity>
				)}
			/>
			<Btn onPress={() => navigate('Write')}>
				<Ionicons name="add" color="white" size={40} />
			</Btn>
		</View>
	);
};

const View = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 0px 20px;
	padding-top: 100px;
	background-color: ${colors.bgColor};
`;

const Title = styled.Text`
	width: 100%;
	margin-bottom: 20px;
	color: ${colors.textColor};
	font-size: 38px;
`;

const Record = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 5px;
	padding: 10px 20px;
	border-radius: 10px;
	background-color: ${colors.cardColor};
`;

const Emotion = styled.Text`
	margin-right: 10px;
	font-size: 24px;
`;

const Message = styled.Text`
	font-size: 18px;
	font-weight: 400;
`;

const Separator = styled.View`
	height: 10px;
`;

const Btn = styled.TouchableOpacity`
	position: absolute;
	bottom: 50px;
	right: 50px;
	width: 80px;
	height: 80px;
	border-radius: 40px;
	justify-content: center;
	align-items: center;
	box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
	background-color: ${colors.btnColor};
`;

export default Home;
