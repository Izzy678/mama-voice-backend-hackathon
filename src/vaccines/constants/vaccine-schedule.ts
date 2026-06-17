export interface VaccineScheduleEntry {
  vaccineId: string;
  vaccineName: string;
  weekAge: number;
  dueDateString: string;
}

export const NIGERIA_VACCINE_SCHEDULE: VaccineScheduleEntry[] = [
  { vaccineId: 'vax-0',  vaccineName: 'BCG, OPV 0 & Hepatitis B',            weekAge: 0,  dueDateString: 'At Birth'  },
  { vaccineId: 'vax-6',  vaccineName: 'Penta 1, OPV 1, PCV 1 & Rotavirus 1', weekAge: 6,  dueDateString: '6 Weeks'   },
  { vaccineId: 'vax-10', vaccineName: 'Penta 2, OPV 2, PCV 2 & Rotavirus 2', weekAge: 10, dueDateString: '10 Weeks'  },
  { vaccineId: 'vax-14', vaccineName: 'Penta 3, OPV 3 & PCV 3',              weekAge: 14, dueDateString: '14 Weeks'  },
  { vaccineId: 'vax-26', vaccineName: 'Vitamin A (1st dose)',                 weekAge: 26, dueDateString: '6 Months'  },
  { vaccineId: 'vax-36', vaccineName: 'Measles-Rubella 1 & Yellow Fever',     weekAge: 36, dueDateString: '9 Months'  },
  { vaccineId: 'vax-52', vaccineName: 'Vitamin A (2nd dose)',                 weekAge: 52, dueDateString: '12 Months' },
  { vaccineId: 'vax-60', vaccineName: 'Measles-Rubella 2',                    weekAge: 60, dueDateString: '15 Months' },
];
