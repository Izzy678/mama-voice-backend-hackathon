export interface LogVaccineBody {
  vaccineId: string;
  administeredDate: string;
  vaccineName?: string;
  isCompleted?: boolean;
  sideEffects?: string;
}
