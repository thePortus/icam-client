// object definition for conferences
export interface Conference {
  id: number;
  title: string;
  year: number;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  locationId: number;
}
