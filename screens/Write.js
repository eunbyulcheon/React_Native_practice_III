import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useDB } from '../context';
import colors from '../colors';
import { AdMobInterstitial, AdMobRewarded } from 'expo-ads-admob';

const emotions = ['🤧', '😍', '🤬', '😭', '🤗', '🤩', '😱'];

const Write = ({ navigation: { goBack } }) => {
	const realm = useDB();
	const [selectedEmotion, setEmotion] = useState(null);
	const [feelings, setFeelings] = useState('');

	const onChangeText = (text) => setFeelings(text);
	const onEmotionPress = (face) => setEmotion(face);
	const onSubmit = async () => {
		if (feelings === '' || selectedEmotion === null) {
			return Alert.alert('Please complete the form.');
		}

		await AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/1712485313');
		await AdMobRewarded.requestAdAsync();
		await AdMobRewarded.showAdAsync();

		AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', () => {
			AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => {
				realm.write(() => {
					realm.create('Feeling', {
						_id: Date.now(),
						emotion: selectedEmotion,
						message: feelings,
					});
				});
				goBack();
			});
		});
	};

	return (
		<View>
			<Title>How do you feel today?</Title>
			<Emotions>
				{emotions.map((emotion, index) => (
					<Emotion
						selected={emotion === selectedEmotion}
						onPress={() => onEmotionPress(emotion)}
						key={index}
					>
						<EmotionText>{emotion}</EmotionText>
					</Emotion>
				))}
			</Emotions>

			<TextInput
				onSubmitEditing={onSubmit}
				value={feelings}
				onChangeText={onChangeText}
				returnKeyType="done"
				placeholder="Write your feelings..."
			/>
			<Btn onPress={onSubmit}>
				<BtnText>Save</BtnText>
			</Btn>
		</View>
	);
};

const View = styled.View`
	flex: 1;
	padding: 0px 20px;
	background-color: ${colors.bgColor};
`;

const Title = styled.Text`
	margin: 50px 0px;
	text-align: center;
	color: ${colors.textColor};
	font-size: 28px;
	font-weight: 500;
`;

const Emotions = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 20px;
`;

const EmotionText = styled.Text`
	font-size: 20px;
`;

const Emotion = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
	background-color: ${(props) => (props.selected ? colors.btnColor : '#fff')};
`;

const TextInput = styled.TextInput`
	padding: 10px 20px;
	border-radius: 20px;
	background-color: #fff;
	font-size: 18px;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

const Btn = styled.TouchableOpacity`
	width: 100%;
	margin-top: 30px;
	padding: 10px 20px;
	border-radius: 20px;
	align-items: center;
	background-color: ${colors.btnColor};
`;

const BtnText = styled.Text`
	color: #fff;
	font-size: 18px;
	font-weight: 500;
`;

export default Write;
