/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useEntityBlockEditor,
	useEntityProp,
	store as coreStore,
} from '@wordpress/core-data';
import {
	Placeholder,
	Spinner,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	__experimentalBlockContentOverlay as BlockContentOverlay,
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';
import { ungroup } from '@wordpress/icons';

export default function ReusableBlockEdit( { attributes: { ref }, clientId } ) {
	const [ hasAlreadyRendered, RecursionProvider ] = useNoRecursiveRenders(
		ref
	);
	const { isMissing, hasResolved } = useSelect(
		( select ) => {
			const persistedBlock = select( coreStore ).getEntityRecord(
				'postType',
				'wp_block',
				ref
			);
			const hasResolvedBlock = select(
				coreStore
			).hasFinishedResolution( 'getEntityRecord', [
				'postType',
				'wp_block',
				ref,
			] );
			return {
				hasResolved: hasResolvedBlock,
				isMissing: hasResolvedBlock && ! persistedBlock,
			};
		},
		[ ref, clientId ]
	);

	const {
		__experimentalConvertBlockToStatic: convertBlockToStatic,
	} = useDispatch( reusableBlocksStore );

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'wp_block',
		{ id: ref }
	);
	const [ title, setTitle ] = useEntityProp(
		'postType',
		'wp_block',
		'title',
		ref
	);

	const blockProps = useBlockProps();

	// Use blockProps as the starting point for innerBlockProps to ensure
	// the overlay does not cause style and layout regressions.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		value: blocks,
		onInput,
		onChange,
		renderAppender: blocks?.length
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	if ( hasAlreadyRendered ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __( 'Block cannot be rendered inside itself.' ) }
				</Warning>
			</div>
		);
	}

	if ( isMissing ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __( 'Block has been deleted or is unavailable.' ) }
				</Warning>
			</div>
		);
	}

	if ( ! hasResolved ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	return (
		<RecursionProvider>
			<div { ...blockProps }>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							onClick={ () => convertBlockToStatic( clientId ) }
							label={ __( 'Convert to regular blocks' ) }
							icon={ ungroup }
							showTooltip
						/>
					</ToolbarGroup>
				</BlockControls>
				<InspectorControls>
					<PanelBody>
						<TextControl
							label={ __( 'Name' ) }
							value={ title }
							onChange={ setTitle }
						/>
					</PanelBody>
				</InspectorControls>
				<BlockContentOverlay clientId={ clientId }>
					<div className="block-library-block__reusable-block-container">
						{
							// Set tabIndex to remove this from keyboard nav since we have
							// duplicated blockProps into this wrapper.  Otherwise keyboard nav
							// will seem to stay on this block for one extra key press.
							<div { ...innerBlocksProps } tabIndex={ -1 } />
						}
					</div>
				</BlockContentOverlay>
			</div>
		</RecursionProvider>
	);
}
