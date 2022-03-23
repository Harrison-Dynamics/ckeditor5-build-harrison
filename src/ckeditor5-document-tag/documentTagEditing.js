import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import {
    toWidget,
    viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils'

import DocumentTagCommand from './documentTagCommand'
import './theme/documentTag.css'

export default class DocumentTagEditing extends Plugin {
    static get requires() {
        return [ Widget ]
    }

    init() {
        this._defineSchema()
        this._defineConverters()

        this.editor.commands.add('documentTag', new DocumentTagCommand(this.editor))

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(
                this.editor.model,
                viewElement => viewElement.hasClass('documentTag')
            )
        )

        this.editor.config.define('documentTagConfig', {
            tags: [],
            strictTags: false
        })
    }

    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('documentTag', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributesOf: '$text',
            allowAttributes: ['tag']
        })
    }

    _defineConverters() {
        const conversion = this.editor.conversion

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['documentTag']
            },
            model: (viewElement, { writer: modelWriter }) => {
                const tag = viewElement.getChild(0).data.slice(2, -2).toUpperCase()

                return modelWriter.createElement('documentTag', { tag } );
            }
        })

        conversion.for('editingDowncast').elementToElement({
            model: 'documentTag',
            view: ( modelItem, { writer: viewWriter } ) => {
                const widgetElement = createDocumentTagView(modelItem, viewWriter)

                return toWidget(widgetElement, viewWriter)
            }
        })

        conversion.for('dataDowncast').elementToElement({
            model: 'documentTag',
            view: (modelItem, { writer: viewWriter }) => (
                createDocumentTagView(modelItem, viewWriter)
            )
        })

        // Helper method for downcast converters.
        function createDocumentTagView( modelItem, viewWriter ) {
            const tagLabel = modelItem.getAttribute('tag').toUpperCase()

            const tagView = viewWriter.createContainerElement(
              'span',
              {
                  class: 'documentTag'
              },
              {
                isAllowedInsideAttributeElement: true
              }
            )

            const innerText = viewWriter.createText('{{' + tagLabel + '}}')
            viewWriter.insert(viewWriter.createPositionAt(tagView, 0), innerText)

            return tagView
        }
    }
}
