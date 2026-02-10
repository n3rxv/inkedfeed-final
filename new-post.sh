#!/bin/bash

# Color codes for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    📝 Inkedfeed Post Creator${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Get post title
read -p "Post title: " title

if [ -z "$title" ]; then
    echo -e "${YELLOW}❌ Title cannot be empty!${NC}"
    exit 1
fi

# Create slug from title (lowercase, replace spaces with hyphens)
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

# Get excerpt
read -p "Short excerpt (1-2 sentences): " excerpt

# Ask about images
read -p "Featured image path (optional, press Enter to skip): " image
read -p "Hero image path (optional, press Enter to skip): " hero_image

# Ask about rotator
read -p "Show in rotator? (y/n, default: n): " rotator_input
if [[ "$rotator_input" == "y" || "$rotator_input" == "Y" ]]; then
    rotator="true"
else
    rotator="false"
fi

# Ask about special tag
read -p "Special tag (e.g., Essay, Featured - optional): " special_tag

# Get current date in ISO format
current_date=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Create filename
filename="src/posts/${slug}.md"

# Check if file already exists
if [ -f "$filename" ]; then
    echo -e "${YELLOW}⚠️  File already exists: $filename${NC}"
    read -p "Overwrite? (y/n): " overwrite
    if [[ "$overwrite" != "y" && "$overwrite" != "Y" ]]; then
        echo -e "${YELLOW}Cancelled.${NC}"
        exit 0
    fi
fi

# Create the post file with frontmatter
cat > "$filename" << EOF
---
layout: post.liquid
title: "$title"
date: $current_date
excerpt: "$excerpt"
EOF

# Add optional fields if provided
if [ ! -z "$image" ]; then
    echo "image: $image" >> "$filename"
fi

if [ ! -z "$hero_image" ]; then
    echo "heroImage: $hero_image" >> "$filename"
fi

echo "rotator: $rotator" >> "$filename"

if [ ! -z "$special_tag" ]; then
    echo "specialTag: \"$special_tag\"" >> "$filename"
fi

# Close frontmatter and add content area
cat >> "$filename" << 'EOF'
---

Write your post content here...

## Example Heading

Your **markdown** content goes here.

- Bullet points work
- Like this

[Links work too](https://example.com)

```javascript
// Code blocks work
const hello = "world";
```

EOF

echo
echo -e "${GREEN}✅ Post created: $filename${NC}"
echo

# Ask if they want to open in editor
read -p "Open in editor now? (y/n): " open_editor
if [[ "$open_editor" == "y" || "$open_editor" == "Y" ]]; then
    # Try to detect and use the best available editor
    if command -v code &> /dev/null; then
        code "$filename"
    elif command -v nano &> /dev/null; then
        nano "$filename"
    elif command -v vim &> /dev/null; then
        vim "$filename"
    else
        open "$filename" 2>/dev/null || xdg-open "$filename" 2>/dev/null || echo "Please open $filename manually"
    fi
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "${BLUE}1. Edit your post: $filename${NC}"
echo -e "${BLUE}2. Run: ${GREEN}./publish-post.sh${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
