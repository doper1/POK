#!/bin/sh

FOLDER="/app/newCards"
MAX_SIZE=500  # 500MB
TARGET_SIZE=475  # 475MB

# Check current folder size
current_size=$(du -sm "$FOLDER" | cut -f1)

if [ "$current_size" -gt "$MAX_SIZE" ]; then
    # Sort files by oldest first and delete until under target size
    while [ "$(du -sm "$FOLDER" | cut -f1)" -gt "$TARGET_SIZE" ]; do
        oldest_file=$(find "$FOLDER" -type f -print0 | xargs -0 ls -t | tail -1)
        
        if [ -z "$oldest_file" ]; then
            break  # No more files to delete
        fi
        
        rm "$oldest_file"
    done
fi