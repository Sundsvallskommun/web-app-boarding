const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import { cx, useForkRef } from '@sk-web-gui/react';
import { DeltaStatic, Sources } from 'quill';
import React, { useEffect, useRef } from 'react';
import { UnprivilegedEditor, Value } from 'react-quill';

export const RichTextEditor = React.forwardRef<
  UnprivilegedEditor,
  {
    value: Value;
    onChange: ((value: string, delta?: DeltaStatic, source?: Sources, editor?: UnprivilegedEditor) => void) | undefined;
    toggleModal?: () => void;
    isMaximizable?: boolean;
    readOnly?: boolean;
    advanced?: boolean;
    errors?: boolean;
    containerLabel?: string;
  }
>(({ value, onChange, isMaximizable = false, readOnly = false, containerLabel = '' }, ref) => {
  const simpleOptions = [['bold'], ['italic'], [{ list: 'bullet' }], [{ list: 'ordered' }]];

  const internalRef = useRef<typeof ReactQuill>();

  useEffect(() => {
    if (internalRef.current) {
      const editor = internalRef.current.getEditor();
      if (editor?.keyboard?.bindings[9]) {
        delete editor.keyboard.bindings[9];
      }
    }
  }, [internalRef]);

  const modules = {
    toolbar:
      isMaximizable ?
        {
          container: `#toolbar-${containerLabel}`,
        }
      : simpleOptions,
  };

  return (
    <div className="h-full mb-16">
      {isMaximizable && (
        <>
          <div id={`toolbar-${containerLabel}`} className="!border-b-0 w-full flex justify-between">
            <div>
              <span className="ql-formats">
                <button aria-label="Välj fetstil" className="ql-bold" />
              </span>
              <span className="ql-formats">
                <button aria-label="Välj kursiv" className="ql-italic" />
              </span>
              <span className="ql-formats">
                <button aria-label="Välj punktlista" className="ql-list" value="bullet" />
              </span>
              <span className="ql-formats">
                <button aria-label="Välj ordnad lista" className="ql-list" value="ordered" />
              </span>
            </div>
          </div>
        </>
      )}

      <ReactQuill
        role="textbox"
        preserveWhitespace={true}
        ref={useForkRef(ref, internalRef)}
        readOnly={readOnly}
        className={cx(`mb-md h-[120px]`)}
        value={value}
        onChange={(val, delta, source, editor, ev) => {
          return onChange(val, delta, source, editor);
        }}
        modules={modules}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
