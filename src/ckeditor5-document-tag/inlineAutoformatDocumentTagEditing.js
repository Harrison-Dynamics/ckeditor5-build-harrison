export default function inlineAutoformatDocumentTagEditing(editor, plugin, regExp, formatCallback) {
	const testCallback = ( text => {
		let result;
		const remove = [];
		const format = [];
        const formatText = [];

		while ( ( result = regExp.exec( text ) ) !== null ) {
			// There should be full match and 3 capture groups.
			if ( result && result.length < 4 ) {
				break;
			}

			let {
				index,
				'1': leftDel,
				'2': content,
				'3': rightDel
			} = result;

			// Real matched string - there might be some non-capturing groups so we need to recalculate starting index.
			const found = leftDel + content + rightDel;
			index += result[ 0 ].length - found.length;

			// Start and End offsets of delimiters to remove.
			const delStart = [
				index,
				index + leftDel.length
			];
			const delEnd = [
				index + leftDel.length + content.length,
				index + leftDel.length + content.length + rightDel.length
			];

			remove.push([index, index + found.length]);
			format.push([index + leftDel.length, index + leftDel.length + content.length ]);
            formatText.push(content.slice())
		}

		return {
			remove,
			format,
            formatText
		};
	} );

	editor.model.document.on( 'change:data', ( evt, batch ) => {
		if ( batch.isUndo || !batch.isLocal || !plugin.isEnabled ) {
			return;
		}

		const model = editor.model;
		const selection = model.document.selection;

		// Do nothing if selection is not collapsed.
		if ( !selection.isCollapsed ) {
			return;
		}

		const changes = Array.from( model.document.differ.getChanges() );
		const entry = changes[ 0 ];

		// Typing is represented by only a single change.
		if ( changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1 ) {
			return;
		}

		const focus = selection.focus;
		const block = focus.parent;
		const { text, range } = getTextAfterCode( model.createRange( model.createPositionAt( block, 0 ), focus ), model );

		const testOutput = testCallback( text );

		const rangesToFormat = testOutputToRanges( range.start, testOutput.format, model );
		const rangesToRemove = testOutputToRanges( range.start, testOutput.remove, model );

		if ( !( rangesToFormat.length && rangesToRemove.length ) ) {
			return;
		}

		// Use enqueueChange to create new batch to separate typing batch from the auto-format changes.
		model.enqueueChange( writer => {
			// Apply format.
            const hasChanged = formatCallback( writer, testOutput.formatText);

			// Strict check on `false` to have backward compatibility (when callbacks were returning `undefined`).
			if ( hasChanged === false ) {
				return;
			}

			// Remove delimiters - use reversed order to not mix the offsets while removing.
          	for ( const range of rangesToRemove.reverse() ) {
				writer.remove( range );
			}

			model.enqueueChange( () => {
				editor.plugins.get( 'Delete' ).requestUndoOnBackspace();
			} );
		} );
	} );
}

// Returns the last text line after the last code element from the given range.
// It is similar to {@link module:typing/utils/getlasttextline.getLastTextLine `getLastTextLine()`},
// but it ignores any text before the last `code`.
//
// @param {module:engine/model/range~Range} range
// @param {module:engine/model/model~Model} model
// @returns {module:typing/utils/getlasttextline~LastTextLineData}
function getTextAfterCode( range, model ) {
	let start = range.start;

	const text = Array.from( range.getItems() ).reduce( ( rangeText, node ) => {
		// Trim text to a last occurrence of an inline element and update range start.
		if ( !( node.is( '$text' ) || node.is( '$textProxy' ) ) || node.getAttribute( 'code' ) ) {
			start = model.createPositionAfter( node );

			return '';
		}

		return rangeText + node.data;
	}, '' );

	return { text, range: model.createRange( start, range.end ) };
}


// Converts output of the test function provided to the inlineAutoformatEditing and converts it to the model ranges
// inside provided block.
//
// @private
// @param {module:engine/model/position~Position} start
// @param {Array.<Array>} arrays
// @param {module:engine/model/model~Model} model
function testOutputToRanges( start, arrays, model ) {
	return arrays
		.filter( array => ( array[ 0 ] !== undefined && array[ 1 ] !== undefined ) )
		.map( array => {
			return model.createRange( start.getShiftedBy( array[ 0 ] ), start.getShiftedBy( array[ 1 ] ) );
		} );
}
