import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Delete from '@ckeditor/ckeditor5-typing/src/delete';

import inlineAutoformatDocumentTagEditing from './inlineAutoformatDocumentTagEditing'
import DocumentTagEditing from './documentTagEditing';
import DocumentTagUI from './documentTagUI';

export default class DocumentTag extends Plugin {
    static get requires() {
        return [ DocumentTagEditing, DocumentTagUI, Delete];
    }

	static get pluginName() {
		return 'DocumentTag';
	}

    afterInit() {
        const tags = this.editor.config.get('documentTagConfig.tags').map(el => el.tag.toUpperCase())

        // If strictTags is enabled, the editor will match only tags provided
        // in the tags configuration list
        const strictTags = this.editor.config.get('documentTagConfig.strictTags')

	    inlineAutoformatDocumentTagEditing(this.editor, this, /(?:^|\s)({{)([^}]+)(}})$/g, (writer, formatText) => {
            for (let tagToFormat of formatText) {
                if (strictTags) {
                    if (!tags.includes(tagToFormat.toUpperCase())) {
                        return false
                    }
                }
                const command = this.editor.commands.get('documentTag')
                command.execute( { 'tag': tagToFormat} );
            }
        })
    }
}

