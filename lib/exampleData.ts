import { LeagueClassicInput, LeagueSearch, pokemon } from "./type";

export const championsData: LeagueClassicInput[] = [
  {
    image: "/api/placeholder/48/48", // Using placeholder for demo
    role: {
      role: "Bot",
      status: true,
    },
    type: {
      type: "Skirmisher",
      status: true,
    },
    range: {
      range: "ranged",
      status: true,
    },
    resource: {
      resource: "Mana",
      status: true,
    },
    gender: {
      gender: "male",
      status: true,
    },
  },
  {
    image: "/api/placeholder/48/48", // Using placeholder for demo
    role: {
      role: "Top",
      status: true,
    },
    type: {
      type: "Juggernaut",
      status: true,
    },
    range: {
      range: "melee",
      status: true,
    },
    resource: {
      resource: "Mana",
      status: false,
    },
    gender: {
      gender: "male",
      status: true,
    },
  },
  {
    image: "/api/placeholder/48/48", // Using placeholder for demo
    role: {
      role: "Mid",
      status: true,
    },
    type: {
      type: "Assassin",
      status: true,
    },
    range: {
      range: "melee",
      status: true,
    },
    resource: {
      resource: "None",
      status: true,
    },
    gender: {
      gender: "female",
      status: true,
    },
  },
];

export const searchChampionData: LeagueSearch[] = [
  {
    name: "Ezreal",
    image: "/api",
    title: "I'm not European."
  },
  {
    name: "Aatrox",
    image: "/api",
    title: "I'm not European."
  },
  {
    name: "Rammus",
    image: "/api",
    title: "I'm not European."
  },
  {
    name: "Ahri",
    image: "/api",
    title: "I'm not European."
  },
  {
    name: "Kayle",
    image: "/api",
    title: "I'm not European."
  }, {
    name: "Syndra",
    image: "/api",
    title: "I'm not European."
  }, {
    name: "Sion",
    image: "/api",
    title: "I'm not European."
  }

]

export const pokemonData : pokemon[] = [
  { image: "string",
    id: 12,
    name:"string",
    type1 : "string",
    type2 : "string",
    class : "string",
    height : 12,
    weight : 12,
    attack : 1,
    speed : 2,
    defense : 3,
    abilities : ["string[]"],
    generation : 1,
    pictures : ["string[]"],
  },
  { image: "string",
    id: 12,
    name:"string",
    type1 : "string",
    type2 : "string",
    class : "string",
    height : 12,
    weight : 12,
    attack : 1,
    speed : 2,
    defense : 3,
    abilities : ["string[]"],
    generation : 1,
    pictures : ["string[]"],
  },
]