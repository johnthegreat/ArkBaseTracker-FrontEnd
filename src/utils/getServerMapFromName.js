// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

const dictionary = {
	"Aberration": "Aberration_P.jpg",
	"Crystal Isles": "CrystalIsles.jpg",
	"Extinction": "Extinction.jpg",
	"Genesis": "Genesis.jpg",
	"Genesis2": "Genesis2.jpg",
	"Lost Island": "LostIsland.jpg",
	"Ragnarok": "Ragnarok.png",
	"Scorched Earth": "ScorchedEarth_P.png",
	"The Center": "TheCenter.jpg",
	"The Island": "TheIsland.jpg",
	"Valgeuro": "Valguero_P.jpg"
};

export default function getServerMapFromName(mapName) {
	return dictionary[mapName];
};