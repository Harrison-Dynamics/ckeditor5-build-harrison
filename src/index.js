import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic'

import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Alignment } from '@ckeditor/ckeditor5-alignment'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import { Bold } from '@ckeditor/ckeditor5-basic-styles'
import { Font } from '@ckeditor/ckeditor5-font'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Italic } from '@ckeditor/ckeditor5-basic-styles'
import { Indent } from '@ckeditor/ckeditor5-indent'
import { Image } from '@ckeditor/ckeditor5-image'
import { ImageCaption } from '@ckeditor/ckeditor5-image'
import { ImageResize } from '@ckeditor/ckeditor5-image'
import { ImageStyle } from '@ckeditor/ckeditor5-image'
import { ImageToolbar } from '@ckeditor/ckeditor5-image'
import { ImageUpload } from '@ckeditor/ckeditor5-image'
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload'
import { Link } from '@ckeditor/ckeditor5-link'
import { List, ListProperties } from '@ckeditor/ckeditor5-list'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office'
import { Table } from '@ckeditor/ckeditor5-table'
import { TableToolbar } from '@ckeditor/ckeditor5-table'
import { TextTransformation } from '@ckeditor/ckeditor5-typing'

import DocumentTag from './ckeditor5-document-tag/documentTag'

export default class HarrisonEditor extends ClassicEditorBase {
    static builtinPlugins = [
        Alignment,
        Autoformat,
        Base64UploadAdapter,
        Bold,
        DocumentTag,
        Essentials,
        Font,
        Heading,
        Image,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        Italic,
        Link,
        List,
        Paragraph,
        PasteFromOffice,
        Table,
        TableToolbar,
        TextTransformation,
    ]

    static defaultConfig = {
        toolbar: [
            'bold', 'italic', '|',
            'outdent', 'indent', 'alignment', '|',
            'link', '|',
            'numberedList', 'bulletedList', '|',
            'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
            'undo', 'redo', 'documentTag'
        ],
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
            ]
        },
        language: 'ro'
    }
}
