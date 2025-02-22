export interface Building {
  name: string;
  code: string;
  classrooms: Classroom[];
}

export interface Classroom {
  id: string;
  name: string;
  availability: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface OpenClassroomsResponse {
  [buildingCode: string]: Building;
}