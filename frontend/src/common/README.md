# Common Components

This folder contains reusable UI components and utilities that are shared across the application.

## Structure

```
common/
├── ui/           # Reusable UI components
│   ├── LoadingSpinner.tsx
│   ├── Button.tsx
│   └── index.ts
├── index.ts      # Main export file
└── README.md     # This file
```

## UI Components

### LoadingSpinner

A reusable loading spinner component with multiple sizes and optional text.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `text`: Optional text to display below the spinner
- `className`: Additional CSS classes

**Usage:**
```tsx
import { LoadingSpinner } from '../common';

// Basic usage
<LoadingSpinner />

// With size and text
<LoadingSpinner size="xl" text="Loading..." />

// With custom classes
<LoadingSpinner className="my-4" />
```

### Button

A reusable button component with multiple variants and sizes.

**Props:**
- `children`: Button content
- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: Boolean to disable the button
- `onClick`: Click handler function
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: Additional CSS classes

**Usage:**
```tsx
import { Button } from '../common';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="lg">Large Secondary</Button>

// With custom classes
<Button className="w-full" onClick={handleClick}>Custom Button</Button>
```

## Adding New Components

1. Create your component in the appropriate subfolder
2. Export it from the subfolder's `index.ts`
3. Re-export it from the main `common/index.ts`
4. Update this README with documentation

## Import Pattern

```tsx
// Import from common folder
import { ComponentName } from '../common';

// Or import specific component
import { ComponentName } from '../common/ui';
```
