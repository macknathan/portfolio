#!/bin/bash

git submodule foreach '
    git add . 
    git commit -m "'"$1"'" || echo "No changes in submodule"
    git push || echo "Nothing to push in submodule"
'

git add .
git commit -m "$1" || echo "No changes in main repo"
git push