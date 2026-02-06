// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { Instructors, Participants, Rooms, Courses, Enrollments } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- INSTRUCTORS ---
  static async getInstructors(): Promise<Instructors[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.INSTRUCTORS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getInstructor(id: string): Promise<Instructors | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.INSTRUCTORS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createInstructor(fields: Instructors['fields']) {
    return callApi('POST', `/apps/${APP_IDS.INSTRUCTORS}/records`, { fields });
  }
  static async updateInstructor(id: string, fields: Partial<Instructors['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.INSTRUCTORS}/records/${id}`, { fields });
  }
  static async deleteInstructor(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.INSTRUCTORS}/records/${id}`);
  }

  // --- PARTICIPANTS ---
  static async getParticipants(): Promise<Participants[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.PARTICIPANTS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getParticipant(id: string): Promise<Participants | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.PARTICIPANTS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createParticipant(fields: Participants['fields']) {
    return callApi('POST', `/apps/${APP_IDS.PARTICIPANTS}/records`, { fields });
  }
  static async updateParticipant(id: string, fields: Partial<Participants['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.PARTICIPANTS}/records/${id}`, { fields });
  }
  static async deleteParticipant(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.PARTICIPANTS}/records/${id}`);
  }

  // --- ROOMS ---
  static async getRooms(): Promise<Rooms[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.ROOMS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getRoom(id: string): Promise<Rooms | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.ROOMS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createRoom(fields: Rooms['fields']) {
    return callApi('POST', `/apps/${APP_IDS.ROOMS}/records`, { fields });
  }
  static async updateRoom(id: string, fields: Partial<Rooms['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.ROOMS}/records/${id}`, { fields });
  }
  static async deleteRoom(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.ROOMS}/records/${id}`);
  }

  // --- COURSES ---
  static async getCourses(): Promise<Courses[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.COURSES}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getCourse(id: string): Promise<Courses | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.COURSES}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createCourse(fields: Courses['fields']) {
    return callApi('POST', `/apps/${APP_IDS.COURSES}/records`, { fields });
  }
  static async updateCourse(id: string, fields: Partial<Courses['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.COURSES}/records/${id}`, { fields });
  }
  static async deleteCourse(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.COURSES}/records/${id}`);
  }

  // --- ENROLLMENTS ---
  static async getEnrollments(): Promise<Enrollments[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.ENROLLMENTS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getEnrollment(id: string): Promise<Enrollments | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.ENROLLMENTS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createEnrollment(fields: Enrollments['fields']) {
    return callApi('POST', `/apps/${APP_IDS.ENROLLMENTS}/records`, { fields });
  }
  static async updateEnrollment(id: string, fields: Partial<Enrollments['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.ENROLLMENTS}/records/${id}`, { fields });
  }
  static async deleteEnrollment(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.ENROLLMENTS}/records/${id}`);
  }

}