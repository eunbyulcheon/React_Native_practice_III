import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDB } from '../context';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '../colors';

const Home = ({ navigation: { navigate } }) => {
	const realm = useDB();
	const [feelings, setFeelings] = useState([]);

	useEffect(() => {
		const feelings = realm.objects('Feeling');
		setFeelings(feelings);
		feelings.addListener(() => {
			const feelings = realm.objects('Feeling');
			setFeelings(feelings);
		});
		return () => {
			feelings.removeAllListeners();
		};
	}, []);

	return (
		<View>
			<Title>My Journal</Title>
			<FlatList
				data={feelings}
				contentContainerStyle={{ paddingVertical: 10 }}
				ItemSeparatorComponent={Separator}
				keyExtractor={(item) => item._id + ''}
				renderItem={({ item }) => (
					<Record>
						<Emotion>{item.emotion}</Emotion>
						<Message>{item.message}</Message>
					</Record>
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
	padding: 0px 20px;
	padding-top: 100px;
	background-color: ${colors.bgColor};
`;

const Title = styled.Text`
	margin-bottom: 80px;
	color: ${colors.textColor};
	font-size: 38px;
`;

const Record = styled.View`
	flex-direction: row;
	align-items: center;
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
