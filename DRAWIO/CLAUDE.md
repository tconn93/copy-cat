# DRAWIO Clone - AI Development Guide

## Project Overview

This project is a clone of draw.io (diagrams.net), a free online diagram software for making flowcharts, process diagrams, org charts, UML, ER diagrams, network diagrams, and more.

**Project Owner:** Tyler Conner
**Start Date:** December 2025
**Status:** Initial Development Phase

## Core Objectives

1. Create a browser-based diagramming tool similar to draw.io
2. Use XML-based file format for diagram storage (compatible with draw.io format)
3. Support multiple diagram types: flowcharts, UML diagrams, network diagrams, org charts, etc.
4. Provide an intuitive drag-and-drop interface
5. Enable export to various formats (PNG, SVG, PDF, XML)

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite (rolldown-vite@7.2.5) - High-performance bundler
- **Language:** JavaScript (JSX)
- **Styling:** CSS (to be expanded with CSS modules or styled-components)

### Backend (If Needed)
- **Framework:** Express.js
- **Purpose:** File storage, user accounts (optional), collaboration features

### Additional Libraries to Consider
- **Canvas/SVG Rendering:**
  - Konva.js or Fabric.js for canvas manipulation
  - React-Konva for React integration
  - Or SVG-based approach with D3.js or plain SVG

- **XML Processing:**
  - fast-xml-parser or xml-js for XML parsing/generation

- **State Management:**
  - Redux Toolkit or Zustand for complex state
  - React Context for simpler state needs

- **File Handling:**
  - FileSaver.js for downloads
  - JSZip for compressed files

## Project Structure

```
DRAWIO/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Canvas/      # Main drawing canvas
│   │   │   ├── Toolbar/     # Tools and shape selector
│   │   │   ├── Sidebar/     # Properties panel
│   │   │   ├── MenuBar/     # Top menu (File, Edit, View, etc.)
│   │   │   └── Shapes/      # Shape library components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   │   ├── xmlParser.js # XML parsing/generation
│   │   │   ├── export.js    # Export functionality
│   │   │   └── shapes.js    # Shape definitions
│   │   ├── store/           # State management
│   │   ├── constants/       # Constants and config
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express backend (optional)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── server.js
│   └── package.json
├── Plan.md                  # Project planning document
└── CLAUDE.md               # This file - AI guidance
```

## Key Features to Implement

### Phase 1: Core Functionality
- [ ] Canvas component with pan and zoom
- [ ] Basic shape library (rectangle, circle, diamond, arrow)
- [ ] Drag and drop shapes onto canvas
- [ ] Select, move, and resize shapes
- [ ] Connect shapes with arrows/lines
- [ ] Text editing on shapes
- [ ] Basic toolbar with common tools

### Phase 2: File Operations
- [ ] XML file format parser/generator
- [ ] Save diagram to XML file
- [ ] Load diagram from XML file
- [ ] Export to PNG
- [ ] Export to SVG
- [ ] Auto-save to local storage

### Phase 3: Advanced Features
- [ ] Undo/Redo functionality
- [ ] Copy/Paste shapes
- [ ] Alignment tools (align left, center, right, etc.)
- [ ] Grouping/ungrouping shapes
- [ ] Layers support
- [ ] Advanced shape styling (colors, borders, shadows)
- [ ] Shape library expansion (UML, network, flowchart symbols)

### Phase 4: Collaboration & Backend (Optional)
- [ ] User authentication
- [ ] Cloud storage for diagrams
- [ ] Real-time collaboration
- [ ] Sharing and permissions
- [ ] Version history

## XML File Format

Draw.io uses an XML-based format (mxGraph). Key structure:

```xml
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z">
  <diagram id="unique-id" name="Page-1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Box" style="rounded=0;" vertex="1" parent="1">
          <mxGeometry x="200" y="150" width="120" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### Key XML Elements
- `mxfile`: Root element containing metadata
- `diagram`: Individual diagram/page
- `mxGraphModel`: Contains grid settings and diagram data
- `root`: Container for all cells
- `mxCell`: Individual shapes, connections, or containers
- `mxGeometry`: Position and size information
- `style`: Visual styling properties

## Development Guidelines

### Code Style
- Use functional components with hooks (no class components)
- Follow React best practices (proper key usage, avoid unnecessary re-renders)
- Keep components small and focused
- Use meaningful variable and function names
- Comment complex logic, especially XML parsing

### State Management
- Start with React Context for global state
- Consider Redux/Zustand if state becomes complex
- Keep canvas state separate from UI state
- Implement proper undo/redo with state history

### Performance Considerations
- Use React.memo for expensive components
- Virtualize large shape libraries
- Debounce canvas operations
- Use requestAnimationFrame for smooth animations
- Consider using Web Workers for XML parsing of large files

### Testing Strategy
- Unit tests for utilities (XML parser, shape calculations)
- Component tests for UI elements
- Integration tests for file operations
- E2E tests for critical user flows

## Getting Started

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Development Workflow
1. Check existing components before creating new ones
2. Test XML import/export with real draw.io files
3. Use browser DevTools for canvas debugging
4. Keep performance in mind (canvas can be heavy)
5. Reference draw.io for UX patterns and features

## Resources

- [draw.io GitHub](https://github.com/jgraph/drawio) - Official draw.io repository
- [mxGraph Documentation](https://jgraph.github.io/mxgraph/) - Original library documentation
- [React Konva](https://konvajs.org/docs/react/) - Canvas library for React
- [Fabric.js](http://fabricjs.com/) - Alternative canvas library
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial) - If using SVG approach

## Common Tasks

### Adding a New Shape
1. Define shape in `src/utils/shapes.js`
2. Create shape component in `src/components/Shapes/`
3. Add to shape library in sidebar
4. Implement XML serialization/deserialization
5. Add styling options

### Implementing Export
1. Capture canvas state
2. Convert to target format (PNG: canvas.toDataURL, SVG: serialize DOM)
3. Use FileSaver.js to download
4. Handle different export options (size, quality, transparency)

### XML File Compatibility
- Test with actual draw.io files
- Ensure bidirectional compatibility (load draw.io files, export loadable files)
- Handle version differences gracefully
- Preserve unknown attributes/elements

## Known Challenges

1. **Canvas Performance:** Large diagrams can slow down; implement viewport culling
2. **XML Compatibility:** draw.io format is complex; start with subset of features
3. **Touch Support:** Mobile/tablet interaction needs special handling
4. **Browser Differences:** Canvas behavior varies; test cross-browser
5. **File Size:** Large diagrams = large XML files; consider compression

## AI Assistant Notes

When working on this project:
- Always check existing code before suggesting new implementations
- Maintain draw.io format compatibility where possible
- Prioritize performance for canvas operations
- Ask clarifying questions about feature scope
- Reference the Plan.md for current priorities
- Test XML import/export with real files when possible
- Consider accessibility (keyboard navigation, screen readers)

## Current Status

**Current Phase:** Initial Setup
**Next Steps:**
1. Design component architecture
2. Choose canvas library (React-Konva recommended)
3. Implement basic canvas with shape rendering
4. Create initial shape library
5. Implement basic XML parser

---

**Last Updated:** December 9, 2025
**By:** Tyler Conner via Claude Code
