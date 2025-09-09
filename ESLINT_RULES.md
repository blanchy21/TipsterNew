# ESLint Rules Configuration

This project uses ESLint to enforce code quality and Next.js best practices.

## 🚫 **Enforced Rules**

### **Image Components**

- **`@next/next/no-img-element: "error"`** - Enforces using Next.js `<Image>` instead of `<img>`
- **Why**: Better performance, automatic optimization, lazy loading

### **Next.js Best Practices**

- **`@next/next/no-html-link-for-pages: "error"`** - Use Next.js `<Link>` for internal navigation
- **`@next/next/no-sync-scripts: "error"`** - Avoid blocking scripts
- **`@next/next/no-title-in-document-head: "error"`** - Use Next.js `<Head>` component
- **`@next/next/no-unwanted-polyfillio: "error"`** - Avoid unnecessary polyfills
- **`@next/next/no-page-custom-font: "error"`** - Use Next.js font optimization
- **`@next/next/no-css-tags: "error"`** - Use CSS modules or styled-jsx
- **`@next/next/no-document-import-in-page: "error"`** - Proper document usage
- **`@next/next/no-head-import-in-document: "error"`** - Proper head usage
- **`@next/next/no-script-component-in-head: "error"`** - Proper script placement
- **`@next/next/no-styled-jsx-in-document: "error"`** - Proper styled-jsx usage

### **React Best Practices**

- **`react/jsx-uses-react: "off"`** - Not needed with React 17+
- **`react/react-in-jsx-scope: "off"`** - Not needed with React 17+
- **`react/prop-types: "off"`** - Using TypeScript instead
- **`react-hooks/exhaustive-deps: "warn"`** - Warn about missing dependencies

### **TypeScript Best Practices**

- **`@typescript-eslint/no-unused-vars: "error"`** - Catch unused variables
- **`@typescript-eslint/no-explicit-any: "warn"`** - Warn about `any` types
- **`@typescript-eslint/explicit-function-return-type: "off"`** - Allow type inference
- **`@typescript-eslint/explicit-module-boundary-types: "off"`** - Allow type inference

### **General Code Quality**

- **`no-console: "warn"`** - Warn about console statements
- **`prefer-const: "error"`** - Enforce const when possible
- **`no-var: "error"`** - Use let/const instead of var
- **`eqeqeq: "error"`** - Use strict equality
- **`curly: "error"`** - Require curly braces

## 🛠️ **Available Scripts**

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Check for <img> elements
npm run check-images

# Type check
npm run type-check
```

## 🔧 **VS Code Integration**

The project includes VS Code settings that:

- Auto-fix ESLint issues on save
- Enable ESLint for TypeScript/React files
- Auto-format code on save

## 🚨 **Pre-commit Hooks**

Git hooks are configured to:

- Run ESLint on staged files
- Fix issues automatically
- Run TypeScript type checking
- Prevent commits with errors

## 📝 **How to Use**

### **Correct Image Usage**

```tsx
import Image from 'next/image';

// ✅ Correct
<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  className="rounded-lg"
/>

// ❌ Incorrect - will cause ESLint error
<img src="/image.jpg" alt="Description" />
```

### **Fixing Issues**

1. **Auto-fix**: Run `npm run lint:fix`
2. **Manual fix**: Follow the ESLint error messages
3. **Check images**: Run `npm run check-images`

## 🎯 **Benefits**

- **Performance**: Optimized images and code
- **Consistency**: Uniform code style
- **Quality**: Catch common mistakes
- **Maintainability**: Clean, readable code
- **Next.js Best Practices**: Follow framework conventions
