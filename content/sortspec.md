---
sorting-spec: "target-folder: .

  index\r

  sortspec

  Player Introduction

  Party

  Sessions

  Timeline

  World of Kyrka


  target-folder: Player Introduction

  Campaign Overview

  PC Creation"
---
---
 //
 // A simple configuration for obsidian-custom-sort plugin
 // (https://github.com/SebastianMC/obsidian-custom-sort)
 // It causes the plugin to take over the control of the order of items in the root folder ('/') of the vault
 // It explicitly sets the sorting to descending ('>') alphabetical ('a-z')
 // Folders and files are treated equally by the plugin (by default) so expect them intermixed
 // in the root vault folder after enabling the custom sort plugin
 // 
 // To play with more examples go to https://github.com/SebastianMC/obsidian-custom-sort#readme

sorting-spec: |
	target-folder: /
	Player Introduction
	Party
	Sessions
	World of Kyrka
	History
	
	target-folder: Player Introduction
	Campaign Overview
	PC Creation
	Abridged History of Kyrka
	Detailed History of Kyrka
	
	target-folder: Party
	Plot Web
---