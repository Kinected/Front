export type BusData = {
  [station: string]: {
    [line: string]: {
      [direction: string]: {
        identifiantstation: string;
        nomstation: string;
        codeligne: string;
        sensligne: string;
        heureestimeedepart: string;
        datemodification: string;
        clemodification: string;
        cletri: string;
      }[];
    };
  };
};

export type VlilleData = {
  name: string;
  nbVelosDispo: number;
  nbPlacesDispo: number;
};
