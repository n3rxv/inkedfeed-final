#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    🚀 Publishing to Inkedfeed${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if there are changes
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  No changes to publish${NC}"
    exit 0
fi

# Show what will be committed
echo -e "${BLUE}Changes to be published:${NC}"
git status -s
echo

# Ask for confirmation
read -p "Publish these changes? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW}Cancelled.${NC}"
    exit 0
fi

# Get commit message (optional)
read -p "Commit message (press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    # Generate default message based on changes
    new_posts=$(git status -s | grep "src/posts" | wc -l | tr -d ' ')
    if [ "$new_posts" -gt 0 ]; then
        commit_msg="Add new post(s)"
    else
        commit_msg="Update content"
    fi
fi

echo
echo -e "${BLUE}📦 Committing changes...${NC}"
git add .
git commit -m "$commit_msg"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Published successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
    echo -e "${BLUE}Your site will update in 1-2 minutes at:${NC}"
    echo -e "${GREEN}https://inkedfeed.pages.dev${NC}"
    echo
else
    echo -e "${RED}❌ Push failed${NC}"
    echo -e "${YELLOW}Try running: git pull origin main${NC}"
    exit 1
fi
