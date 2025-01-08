import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';

const extensions = [
  BaseKit.configure({
    // Show placeholder
    placeholder: {
      showOnlyCurrent: true,
    },

    // Character count
    characterCount: {
      limit: 50_000,
    },
  }),
];

export default function TestEditor() {
  return (
    <RichTextEditor
      output='html'
      content={''}
      onChangeContent={(value) => {
        console.log(value);
      }}
      extensions={extensions}
    />
  );
}
