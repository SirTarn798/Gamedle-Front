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
  image:string,
  name:string,
  title:string,
}

export type UploadPicture = {
  type : "champion" | "pokemon"
  file : "picture" | "icon"
}
