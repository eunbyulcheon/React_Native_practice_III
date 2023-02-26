import React from 'react';
import colors from '../colors';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const Home = ({ navigation: { navigate } }) => {
	return (
		<View>
			<Title>My Journal</Title>
			<Btn onPress={() => navigate('Write')}>
				<Ionicons name="add" color="white" size={40} />
			</Btn>
		</View>
	);
};

const View = styled.View`
	flex: 1;
	padding: 0px 50px;
	padding-top: 100px;
	background-color: ${colors.bgColor};
`;

const Title = styled.Text`
	margin-bottom: 100px;
	color: ${colors.textColor};
	font-size: 38px;
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
	background-color: ${colors.btnColor};
`;

const BtnText = styled.Text`
	color: #fff;
`;

export default Home;
