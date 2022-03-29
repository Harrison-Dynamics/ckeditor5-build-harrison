import Command from '@ckeditor/ckeditor5-core/src/command'

export default class DocumentTagCommand extends Command {
    execute({tag}) {
        const editor = this.editor
        const selection = editor.model.document.selection

        editor.model.change(writer => {
            const documentTag = writer.createElement('documentTag', {
                ...Object.fromEntries(selection.getAttributes()),
                tag: tag
            })

            editor.model.insertContent(documentTag)
        })
    }

    refresh() {
        const model = this.editor.model
        const selection = model.document.selection

        const isAllowed = model.schema.checkChild(selection.focus.parent, 'documentTag')

        this.isEnabled = isAllowed
    }
}
