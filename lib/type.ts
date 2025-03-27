export type LeagueClassicInput = {
  image: string;
  role: {
    role: string;
    status: boolean;
  };
  type: {
    type: string;
    status: boolean;
  };
  range: {
    range: "ranged" | "melee";
    status: boolean;
  };
  resource: {
    resource: string;
    status: boolean;
  };
  gender: {
    gender: string | null;
    status: boolean;
  };
};

export type LeagueSearch = {
  image: string,
  name: string,
  title: string,
}

export type UploadPicture = {
  type: "champion" | "pokemon"
  file: "picture" | "icon"
}

export type champion = {
  id: number,
  name: string,
  region: string,
  gender: "male" | "female" | null,
  nick_name: string,
  class: string,
  release_date: Date,
  role: lane[],
  range_type: "melee" | "ranged",
  resource_type: string,
  icon: string,
  pictures: string[];
}

export type pokemon = {
  id: number,
  name:string,
  type1 : string,
  type2 : string | null,
  class : string,
  height : number,
  weight : number,
  abilities : string[],
  generation : number,
  pictures : string[];
}

export type lane = "top" | "jungle" | "mid" | "bot" | "support"

export type UpdateChampPayload = {
  championName: string;
  updates: {
    imageChanges: {
      icon?: File;
      addedPictures: File[];
      deletedPictures: string[];
    }
    // other champion update fields
  }
}

export type UpdatePokemonPayload = {
  pokemonName: string;
  updates: {
    imageChanges: {
      addedPictures: File[];
      deletedPictures: string[];
    }
    // other champion update fields
  }
}

export type UploadedUrls = Record<string, string[]>
