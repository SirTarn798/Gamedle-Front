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
