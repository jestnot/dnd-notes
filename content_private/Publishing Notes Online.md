---
title: Publishing Notes Online
draft: true
tags:
  -
---
# Steps to Update
1. In Obsidian, save document
2. Open content in file explorer
	1. ![[Pasted image 20250911221853.png]]
3. In file explorer, open Terminal
	1. ![[Pasted image 20250911221917.png]]
4. In Terminal, type `npx quartz build --serve`
	1. This will run the local server so you can access http://localhost:8080/ in web browser
	2. When you save changes in Obsidian, re-run the server (press ctrl + C and retype `npx quartz build --serve`) to update local host changes
5. To update the live page, type `npx quartz sync`

For subsequent updates:
1. In Obsidian, save document
2. In Terminal
# My Links
Github: https://github.com/jestnot/dnd-notes

Website: https://jestnot.github.io/dnd-notes/
# Reference Links
How to publish: https://notes.nicolevanderhoeven.com/How+to+publish+Obsidian+notes+with+Quartz+on+GitHub+Pages

Quartz configuration: https://quartz.jzhao.xyz/configuration

Obsidian plugins for D&D
- https://plugins.javalent.com/home