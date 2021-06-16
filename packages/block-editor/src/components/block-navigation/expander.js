/**
 * WordPress dependencies
 */
import { chevronRightSmall, Icon } from '@wordpress/icons';
export default function BlockNavigationExpander( { onClick } ) {
	return (
		// Keyboard events are handled by TreeGrid see: components/src/tree-grid/index.js
		//
		// The expander component is implemented as a pseudo element in the w3 example
		// https://www.w3.org/TR/wai-aria-practices/examples/treegrid/treegrid-1.html
		//
		// We've mimicked this by adding an icon with aria-hidden set to true to hide this from the accessibility tree.
		// For the current tree grid implementation, please do not try to make this a button.
		//
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<span
			className="block-editor-block-navigation__expander"
			onClick={ ( event ) => onClick( event, { forceToggle: true } ) }
			aria-hidden="true"
		>
			<Icon icon={ chevronRightSmall } />
		</span>
	);
}
