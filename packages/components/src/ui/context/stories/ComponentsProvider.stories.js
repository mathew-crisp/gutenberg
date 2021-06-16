/**
 * WordPress dependencies
 */
import { createContext, useContext, memo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Card, CardBody } from '../../';
import { View } from '../../../view';
import { Text } from '../../../text';
import { ContextSystemProvider } from '../index';

const SomeContext = createContext();
const useSomeContext = () => useContext( SomeContext );

export default {
	component: ContextSystemProvider,
	title: 'G2 Components (Experimental)/ContextSystemProvider',
};

const outerContext = {
	Card: {
		isRounded: false,
		elevation: 10,
	},
	CardBody: {
		as: 'a',
		href: 'https://wordpress.org',
		style: {
			display: 'block',
		},
	},
};

const innerContext = {
	Card: {
		style: {
			background: 'white',
		},
	},
	CardBody: {
		as: 'div',
	},
	Text: {
		style: {
			outline: '4px dashed purple',
		},
	},
};

const InnerContent = memo( () => {
	const state = useSomeContext();
	const isEven = state % 2 === 0;
	return (
		<View style={ { background: isEven ? 'red' : 'initial' } }>
			<Text>Card (inside innerContext)</Text>
			<br />
			<Text>Counter:{ state }</Text>
		</View>
	);
} );

const InnerCard = memo( () => {
	return (
		<View style={ { padding: 40 } }>
			<Card>
				<CardBody style={ { border: '3px solid green' } }>
					<InnerContent />
				</CardBody>
			</Card>
		</View>
	);
} );

export const Default = () => {
	const [ state, update ] = useState( 0 );
	const forceUpdate = () => update( ( prev ) => prev + 1 );

	return (
		<SomeContext.Provider value={ state }>
			<button onClick={ forceUpdate }>
				Force Update (increment counter)
			</button>
			<ContextSystemProvider value={ outerContext }>
				<Card>
					<CardBody>
						<Text>Card (inside outerContext)</Text>
						<ContextSystemProvider value={ innerContext }>
							<InnerCard />
						</ContextSystemProvider>
					</CardBody>
				</Card>
			</ContextSystemProvider>
			<Card>
				<CardBody>
					<Text>Card (outside of outerContext)</Text>
				</CardBody>
			</Card>
		</SomeContext.Provider>
	);
};
