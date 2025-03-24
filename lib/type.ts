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
  picture: string[];
}

export type lane = "top" | "jungle" | "mid" | "bot" | "support"

export type UpdateChampPayload = {
  championId: number;
  updates: {
    imageChanges: {
      icon?: File;
      addedPictures: File[];
      deletedPictures: string[];
    }
    // other champion update fields
  }
}