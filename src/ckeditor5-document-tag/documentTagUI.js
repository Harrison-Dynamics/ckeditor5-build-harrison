import Model from '@ckeditor/ckeditor5-ui/src/model'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'

export default class DocumentTagUI extends Plugin {
    init() {
        const editor = this.editor
        const t = editor.t

        const tags = editor.config.get('documentTagConfig.tags')

        editor.ui.componentFactory.add('documentTag', locale => {
            const dropdownView = createDropdown(locale)

            addListToDropdown(dropdownView, getDropdownItemsDefinitions(tags))

            dropdownView.buttonView.set({
                label: t( 'Taguri' ),
                tooltip: true,
                withText: true
            })

            // Disable button when the command is disabled.
            const command = editor.commands.get('documentTag')
            dropdownView.bind( 'isEnabled' ).to(command)

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute('documentTag', { 'tag': evt.source.commandParam.tag })
                editor.editing.view.focus()
            })

            return dropdownView
        })
    }
}

function getDropdownItemsDefinitions( tags ) {
    const itemDefinitions = new Collection()

    for (const tag of tags) {
        const definition = {
            type: 'button',
            model: new Model({
                commandParam: tag,
                label: tag.label,
                withText: true
            })
        }

        // Add tag definition to the collection.
        itemDefinitions.add(definition)
    }

    return itemDefinitions
}

