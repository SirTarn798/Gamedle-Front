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
  image: string,
  id: number,
  name:string,
  type1 : string,
  type2 : string | null,
  height : number,
  weight : number,
  attack : number,
  defense : number,
  speed : number,
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

export interface ChampionGuessResult {
  result: {
    name: {
      value: string;       // The name of the champion guessed
      correct: boolean;    // Whether the name is correct
    };
    title: {
      value: string;       // Champion's title
      correct: boolean;    // Whether the title is correct
    };
    release_date: {
      value: string;       // Champion's release date
      correct: boolean;    // Whether the release date is correct
      hint?: string;       // Optional hint about the date (e.g., 'Too Early', 'Too Late')
    };
    class: {
      value: string;       // Champion's class (e.g., Marksman, Juggernaut)
      correct: boolean;    // Whether the class is correct
    };
    range_type: {
      value: string;       // Champion's attack range (Ranged/Melee)
      correct: boolean;    // Whether the range type is correct
    };
    resource_type: {
      value: string;       // Champion's resource type (Mana, Energy, etc.)
      correct: boolean;    // Whether the resource type is correct
    };
    gender: {
      value: string;       // Champion's gender
      correct: boolean;    // Whether the gender is correct
    };
    region: {
      value: string;       // Champion's region/origin
      correct: boolean;    // Whether the region is correct
    };
    roles?: {
      value: string[];     // Champion's roles
      correct: boolean;    // Whether the roles are correct
      roles_match?: any;   // Additional details about role matching
    };
  };
  is_correct: boolean;     // Whether the entire guess is correct
  status: 'partial' | 'incorrect' | 'correct';  // Overall guess status
  guess_champion_icon: string;  // Path to the icon of the guessed champion
  correct_champion_icon: string;  // Path to the icon of the correct champion
  progress: {
    [key: string]: {  // Indexed progress of guesses
      id: number;
      name: string;
      title: string;
      release_date: string;
      class: string;
      range_type: string;
      resource_type: string;
      gender: string;
      region: string;
      icon_path: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
      pivot?: any;  // Additional pivot information
    }
  };
}
