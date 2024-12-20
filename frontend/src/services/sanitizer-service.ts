import SanitizeHTML from 'sanitize-html';

const config = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'del',
    'br',
    'div',
    'sup',
    'sub',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {},
};

export const sanitized: (unsafe: string) => string = (unsafe) => {
  return SanitizeHTML(unsafe, config);
};

export default sanitized;
