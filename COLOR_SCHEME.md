# Color Scheme Reference

This document outlines the color schemes for both light and dark modes used in Moon Seven.

## Light Mode

### Base Colors
- **Background**: `#fafafa` - Main page background
- **Foreground**: `#1a1a1a` - Primary text color
- **Surface**: `#ffffff` - Card/component backgrounds
- **Surface Elevated**: `#f5f5f5` - Elevated surfaces (hover states, etc.)

### Text Colors
- **Primary**: `#1a1a1a` - Main text
- **Secondary**: `#525252` - Secondary text
- **Tertiary**: `#737373` - Muted/disabled text

### Accent Colors (Moon-inspired)
- **Primary**: `#6366f1` - Indigo (main accent)
- **Secondary**: `#8b5cf6` - Purple (secondary accent)
- **Moon**: `#f5f5dc` - Beige/cream (moon color)

### Border Colors
- **Border**: `#e5e5e5` - Standard borders
- **Border Subtle**: `#f5f5f5` - Subtle borders

### Interactive Colors
- **Hover**: `#f5f5f5` - Hover background
- **Active**: `#e5e5e5` - Active/pressed state

### Status Colors
- **Success**: `#10b981` - Green
- **Warning**: `#f59e0b` - Amber
- **Error**: `#ef4444` - Red
- **Info**: `#3b82f6` - Blue

## Dark Mode

### Base Colors
- **Background**: `#0a0a0a` - Main page background (near black)
- **Foreground**: `#fafafa` - Primary text color (near white)
- **Surface**: `#171717` - Card/component backgrounds
- **Surface Elevated**: `#262626` - Elevated surfaces

### Text Colors
- **Primary**: `#fafafa` - Main text
- **Secondary**: `#d4d4d4` - Secondary text
- **Tertiary**: `#a3a3a3` - Muted/disabled text

### Accent Colors (Moon-inspired)
- **Primary**: `#818cf8` - Light indigo (main accent)
- **Secondary**: `#a78bfa` - Light purple (secondary accent)
- **Moon**: `#e8e6e3` - Light beige/cream (moon color)

### Border Colors
- **Border**: `#262626` - Standard borders
- **Border Subtle**: `#171717` - Subtle borders

### Interactive Colors
- **Hover**: `#262626` - Hover background
- **Active**: `#404040` - Active/pressed state

### Status Colors
- **Success**: `#34d399` - Light green
- **Warning**: `#fbbf24` - Light amber
- **Error**: `#f87171` - Light red
- **Info**: `#60a5fa` - Light blue

## Usage

### CSS Variables
All colors are available as CSS variables:
```css
background-color: var(--background);
color: var(--text-primary);
border-color: var(--border);
```

### Tailwind Classes
The colors are also available through Tailwind's theme system:
- `bg-background`, `bg-surface`, `bg-surface-elevated`
- `text-primary`, `text-secondary`, `text-tertiary`
- `border-border`, `border-border-subtle`
- `accent-primary`, `accent-secondary`, `accent-moon`
- And more...

## Transition
All color changes include a smooth 0.3s transition for a polished user experience when switching between light and dark modes.
