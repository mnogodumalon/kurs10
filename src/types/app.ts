// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Instructors {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
  };
}

export interface Participants {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    birth_date?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Rooms {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    room_name?: string;
    building?: string;
    capacity?: number;
  };
}

export interface Courses {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    title?: string;
    description?: string;
    start_date?: string; // Format: YYYY-MM-DD oder ISO String
    end_date?: string; // Format: YYYY-MM-DD oder ISO String
    max_participants?: number;
    price?: number;
    instructor?: string; // applookup -> URL zu 'Instructors' Record
    room?: string; // applookup -> URL zu 'Rooms' Record
  };
}

export interface Enrollments {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    participant?: string; // applookup -> URL zu 'Participants' Record
    course?: string; // applookup -> URL zu 'Courses' Record
    enrollment_date?: string; // Format: YYYY-MM-DD oder ISO String
    paid?: boolean;
  };
}

export const APP_IDS = {
  INSTRUCTORS: '6985cbbd8ef24c751d830d73',
  PARTICIPANTS: '6985cbbe1d4958e93bc59890',
  ROOMS: '6985cbbe7076184748f8a68d',
  COURSES: '6985cbbec07f1d49e57bb4a8',
  ENROLLMENTS: '6985cbbf3127a45b804d94e0',
} as const;

// Helper Types for creating new records
export type CreateInstructors = Instructors['fields'];
export type CreateParticipants = Participants['fields'];
export type CreateRooms = Rooms['fields'];
export type CreateCourses = Courses['fields'];
export type CreateEnrollments = Enrollments['fields'];